interface Props {
  message?: string;
}

export default function LoadingSpinner({ message = "Đang tải..." }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
      <p className="mt-4 text-sm">{message}</p>
    </div>
  );
}
