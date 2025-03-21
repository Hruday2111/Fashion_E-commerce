export function Button({ children, type = "button", ...props }) {
    return (
      <button
        type={type}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        {...props}
      >
        {children}
      </button>
    );
  }
  