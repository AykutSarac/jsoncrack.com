import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useMonaco } from '@monaco-editor/react';
import TextEditor from '../TextEditor';
import useFile from '../../../store/useFile';
import useConfig from '../../../store/useConfig';

// Mock Monaco Editor and its dependencies
jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  useMonaco: jest.fn(),
  loader: { config: jest.fn() },
  // A simple mock editor that renders a textarea and calls onChange on typing.
  default: ({ value, onChange, onValidate, onMount }: any) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={e => onChange && onChange(e.target.value)}
      // Simulate validate behavior on blur by passing an empty errors array.
      onBlur={() => onValidate && onValidate([])}
      // onMount is called with an editor object that now includes a dummy getAction
      ref={el =>
        el &&
        onMount &&
        onMount({
          onDidPaste: (cb: () => void) => cb(),
          getAction: (actionId: string) => ({
            run: () => {} // Dummy run implementation.
          }),
        })
      }
    />
  )
}));

// Mock the file store
jest.mock('../../../store/useFile', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Mock the config store
jest.mock('../../../store/useConfig', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('TextEditor', () => {
  let defaultFileStoreMock: any;

  beforeEach(() => {
    defaultFileStoreMock = {
      contents: '{"test": "data"}',
      setContents: jest.fn(),
      setError: jest.fn(),
      jsonSchema: null,
      getHasChanges: jest.fn().mockReturnValue(false),
      format: 'json'
    };

    // Fix: Mock each selector call individually
    (useFile as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(defaultFileStoreMock);
      }
      return defaultFileStoreMock;
    });

    (useConfig as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ darkmodeEnabled: false });
      }
      return { darkmodeEnabled: false };
    });
  });

  it('renders with initial content', () => {
    render(<TextEditor />);
    expect(screen.getByTestId('monaco-editor')).toHaveValue(defaultFileStoreMock.contents);
  });

  it('updates content on change', () => {
    render(<TextEditor />);
    const editor = screen.getByTestId('monaco-editor');
    fireEvent.change(editor, { target: { value: '{"updated": "true"}' } });
    expect(defaultFileStoreMock.setContents).toHaveBeenCalledWith({
      contents: '{"updated": "true"}',
      skipUpdate: true
    });
  });

  it('warns on unsaved changes when leaving the page', () => {
    // Simulate unsaved changes
    defaultFileStoreMock.getHasChanges.mockReturnValue(true);
    render(<TextEditor />);

    const beforeUnloadEvent = new Event('beforeunload');
    Object.defineProperty(beforeUnloadEvent, 'returnValue', {
      writable: true,
      value: ''
    });
    fireEvent(window, beforeUnloadEvent);

    expect(defaultFileStoreMock.getHasChanges).toHaveBeenCalled();
  });

  it('applies JSON schema validation when a schema is provided', () => {
    const mockSetDiagnosticsOptions = jest.fn();
    const mockMonaco = {
      languages: {
        json: {
          jsonDefaults: {
            setDiagnosticsOptions: mockSetDiagnosticsOptions
          }
        }
      }
    };

    (useMonaco as jest.Mock).mockReturnValue(mockMonaco);
    const schema = { type: 'object' };
    defaultFileStoreMock.jsonSchema = schema;

    render(<TextEditor />);

    expect(mockSetDiagnosticsOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        validate: true,
        allowComments: true,
        enableSchemaRequest: true,
        schemas: [expect.objectContaining({
          uri: expect.any(String),
          fileMatch: ['*'],
          schema
        })]
      })
    );
  });
});