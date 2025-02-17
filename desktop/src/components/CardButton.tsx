interface CardButtonProps {
  onClick: () => void
  title: string
  description: string
}

export const CardButton: React.FC<CardButtonProps> = ({
  onClick,
  title,
  description,
}: CardButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="m-4 max-w-xs rounded-xl border border-gray-200 p-6 text-left text-inherit transition-colors hover:border-blue-600 hover:text-blue-600 focus:border-blue-600 focus:text-blue-600 active:border-blue-600 active:text-blue-600"
  >
    <h2 className="mb-4 text-2xl">{title} &rarr;</h2>
    <p className="m-0 text-xl">{description}</p>
  </button>
)
