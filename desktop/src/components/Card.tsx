interface CardProps {
  url: string
  title: string
  description: string
}

export const Card: React.FC<CardProps> = ({
  url,
  title,
  description,
}: CardProps) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="m-4 max-w-xs rounded-xl border border-gray-200 p-6 text-left text-inherit transition-colors hover:border-blue-600 hover:text-blue-600 focus:border-blue-600 focus:text-blue-600 active:border-blue-600 active:text-blue-600"
  >
    <h2 className="mb-4 text-2xl">{title} &rarr;</h2>
    <p className="m-0 text-xl">{description}</p>
  </a>
)
