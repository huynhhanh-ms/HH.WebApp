import DropdownMenu from "./dropdown-menu"

export default function FilterCard() {
  return (
<div className="flex items-center justify-center px-8 py-2 space-x-8 bg-white">
          <DropdownMenu
            // label="Categories"
            label="Phân loại"
            options={["Option 1", "Option 2", "Option 3"]}
          />
          <DropdownMenu
            // label="Material"
            label="Chất liệu"
            options={["Option 1", "Option 2", "Option 3"]}
          />
          <DropdownMenu
            // label="Color"
            label="Màu sắc"
            options={["Option 1", "Option 2", "Option 3"]}
          />
          <DropdownMenu
            // label="Price Range"
            label="Khoảng giá"
            options={["Option 1", "Option 2", "Option 3"]}
          />
        </div>


  );
}