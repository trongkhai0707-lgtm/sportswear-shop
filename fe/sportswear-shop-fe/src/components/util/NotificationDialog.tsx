// NotificationDialog.tsx

import {
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationCircle,
} from "react-icons/fa";

type NotificationType = "success" | "info" | "error";

interface Props {
  open: boolean;
  type: NotificationType;
  message: string;
  onClose: () => void;
}

export default function NotificationDialog({
  open,
  type,
  message,
  onClose,
}: Props) {
  if (!open) return null;

  const config = {
    success: {
      title: "Thành công",
      icon: <FaCheckCircle />,
      color: "text-green-400",
    },

    info: {
      title: "Thông báo",
      icon: <FaInfoCircle />,
      color: "text-blue-400",
    },

    error: {
      title: "Lỗi",
      icon: <FaExclamationCircle />,
      color: "text-red-400",
    },
  };

  const current = config[type];

  return (
    <div
      onClick={onClose}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
      "
    >
      {/* DIALOG */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-[360px]
          rounded-2xl
          bg-zinc-900
          p-6
          text-white
          shadow-2xl

          transition-all duration-200
          animate-[fadeIn_.2s_ease]
        "
      >
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className={`text-3xl ${current.color}`}>{current.icon}</div>

          <h2 className="text-2xl font-bold">{current.title}</h2>
        </div>

        {/* MESSAGE */}
        <p
          className="
            mt-5
            text-base
            leading-relaxed
            text-gray-200
          "
        >
          {message}
        </p>

        {/* HINT */}
        <p
          className="
            mt-6
            text-center text-sm
            text-gray-500
          "
        >
          Nhấn bên ngoài để đóng
        </p>
      </div>
    </div>
  );
}
