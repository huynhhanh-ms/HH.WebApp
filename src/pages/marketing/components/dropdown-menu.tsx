// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DropdownMenu = ({ label }: { label: string; options: string[] }) => (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:ring-1"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {label}
          <svg
            className="w-5 h-5 ml-2 -mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {/* <div
        className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
              tabIndex={parseInt("-1")}
      >
        <div className="py-1" role="none">
          {options.map((option, index) => (
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700"
              role="menuitem"
              tabIndex={parseInt("-1")}
              id={`menu-item-${index}`}
              key={index}
            >
              {option}
            </a>
          ))}
        </div>
      </div> */}
    </div>
  );

export default DropdownMenu;