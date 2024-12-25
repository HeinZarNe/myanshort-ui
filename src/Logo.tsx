export const Logo = () => {
  return (
    <a
      href="/"
      className={` block px-2 py-1 rounded-lg shadow-md shine ${
        location.pathname.includes("/ad") ? "bg-gray-700" : "bg-blue-500"
      }`}
    >
      <p
        className={` text-4xl font-ubuntu ${
          location.pathname.includes("/ad") ? "text-blue-400" : "text-white"
        }`}
      >
        M
      </p>
    </a>
  );
};
