interface ActionRemarkTagProps {
  remark: string
}

export function ActionRemarkTag({ remark }: ActionRemarkTagProps) {
  return (
    <span className="text-sm text-gray-600">
      {remark}
    </span>
  )
}
