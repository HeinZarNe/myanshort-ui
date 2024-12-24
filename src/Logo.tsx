export const Logo = () => {
  return (
    <a
      href="/"
      className={` block px-2 py-1 rounded-lg shadow-md ${
        location.pathname.includes("/ad") ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <p
        className={` text-4xl font-ubuntu ${
          location.pathname.includes("/ad") ? "text-blue-200" : "text-blue-500"
        }`}
      >
        M
      </p>
    </a>
  );
};
