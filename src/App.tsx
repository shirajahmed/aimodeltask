import { ChangeEvent, useMemo, useState } from "react";
import "./App.css";
import CreateModelModal from "./components/CreateModelModal ";
import { Toaster } from "react-hot-toast";

interface MenuItem {
  name: string;
  icon: string;
  special?: boolean;
  href?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuItems: MenuSection[] = [
  {
    title: "Model Library",
    items: [{ name: "Model Library", icon: "/icons/grid.svg", special: true }],
  },
  {
    title: "Extraction Builder",
    items: [
      { name: "Label Data", href: "/", icon: "/icons/griddark.svg" },
      { name: "Model", icon: "/icons/layers-round.svg" },
      { name: "Test", icon: "/icons/task.svg" },
    ],
  },
  {
    title: "Help",
    items: [
      { name: "Setting", icon: "/icons/setting.svg" },
      { name: "Support", icon: "/icons/teacher.svg" },
    ],
  },
];

interface Header {
  label: string;
  key: string;
  sortable: boolean;
}

const headers: Header[] = [
  { label: "Model Name", key: "modelName", sortable: true },
  { label: "Model Type", key: "modelType", sortable: true },
  { label: "Description", key: "description", sortable: true },
  { label: "Created On", key: "createdOn", sortable: true },
  { label: "Last Trained On", key: "lastTrainedOn", sortable: true },
  { label: "Status", key: "status", sortable: true },
  { label: "Action", key: "action", sortable: false },
];

interface ModelData {
  modelName: {
    name: string;
    id: string;
  };
  modelType: string;
  description: string;
  createdOn: string;
  lastTrainedOn: string;
  status: string;
  action: string;
}

const generateDummyData = (): ModelData[] => {
  const data: ModelData[] = [];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 1; i <= 20; i++) {
    const letter = alphabet[(i - 1) % alphabet.length];
    data.push({
      modelName: { name: `Model ${letter}`, id: `#${5000000 + i}` },
      modelType: "Extraction",
      description: `Description for Model ${letter}`,
      createdOn: "29/02/2024",
      lastTrainedOn: "29/02/2024",
      status: i % 2 === 0 ? "Active" : "Inactive",
      action: "/icons/outline-dots-vertical.svg",
    });
  }
  return data;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [models] = useState<ModelData[]>(generateDummyData());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Filter ddata on seach
  const filteredData = useMemo(() => {
    return models.filter(
      (model) =>
        model.modelName.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.modelName.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [models, searchTerm]);

  // Sort column
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      let aVal: string = "";
      let bVal: string = "";
      if (sortColumn === "modelName") {
        aVal = a.modelName.name;
        bVal = b.modelName.name;
      } else {
        // @ts-ignore
        aVal = a[sortColumn];
        // @ts-ignore
        bVal = b[sortColumn];
      }
      return aVal.localeCompare(bVal);
    });
    return sortOrder === "asc" ? sorted : sorted.reverse();
  }, [filteredData, sortColumn, sortOrder]);

  //  pagination calculatiooon
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  // Handle sort
  const handleSort = (key: string, sortable: boolean) => {
    if (!sortable) return;
    if (sortColumn === key) {
      setSortOrder((prev: any) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(key);
      setSortOrder("asc");
    }
  };

  // handle search
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle pagination
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Generate paginationfor a small numbber
  const paginationButtons: any[] = [];
  for (let i: number = 1; i <= totalPages; i++) {
    paginationButtons.push(i);
  }
  return (
    <div className="flex h-screen w-full bg-gray-100">
      <aside
        className={`${
          isSidebarOpen ? "w-[264px]" : "w-16"
        } flex flex-col relative transition-all duration-300 shadow-[2px_95px_6px_0px_rgba(0,_0,_0,_0.1)]`}
      >
        <div
          className={`${
            isSidebarOpen ? "w-[264px]" : "w-16"
          } h-[90px] relative px-[24px] py-[30px] flex items-center`}
        >
          {isSidebarOpen ? (
            <img
              src="/icons/Aventisia.png"
              alt="Aventisia Logo"
              className="w-[166px]"
            />
          ) : (
            <span className="text-2xl font-bold tracking-wide">A</span>
          )}
          <div
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute cursor-pointer top-1/2 transform -translate-y-1/2 right-0 h-[36px] w-[14px] bg-white rounded-l-md flex items-center justify-center"
          >
            <img
              src="/icons/Vectorl.svg"
              alt="Toggle Sidebar"
              className={`w-[6px] h-auto transform ${
                !isSidebarOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
        <nav
          className={`flex-1 flex flex-col ${
            isSidebarOpen ? "p-[20px]" : "p-[14px]"
          } bg-white`}
        >
          {menuItems.map((section, index) => (
            <div key={index} className="flex flex-col pb-[28px]">
              {isSidebarOpen && (
                <div className="text-[14px] font-semibold pb-[8px] text-[#202020]">
                  {section.title}
                </div>
              )}
              <div className="flex flex-col gap-1">
                {section.items.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href || "#"}
                    className={`flex items-center space-x-3 p-2 rounded-md hover:bg-primary hover:text-[#F8FAFC] ${
                      item.special
                        ? "bg-secondary text-[#F8FAFC]"
                        : "text-[#202020]"
                    }`}
                  >
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="w-[30px] h-[30px]"
                    />
                    {isSidebarOpen && (
                      <span className="text-[16px] font-normal leading-[26px]">
                        {item.name}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <header className="h-[90px] flex items-center justify-between bg-white border-b border-gray-200 px-[24px] py-[30px] shadow-[-2px_2px_6px_0px_rgba(0,_0,_0,_0.1)]">
          <div className="flex items-center space-x-2">
            <h1 className="text-[20px] font-semibold text-gray-800">
              AI/ML Model Builder
            </h1>
          </div>
          <div className="flex-1 max-w-[280px] mx-4 bg-[#F3F3FD] rounded-md">
            <div className="relative bg-[#F3F3FD] rounded-md">
              <input
                type="text"
                className="w-full border bg-[#F3F3FD] border-[#F3F3FD] rounded-md py-2 pl-8 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search"
                style={{
                  color: "#CBD5E1",
                  fontWeight: "400",
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              />
              <img
                src="/icons/searchico.svg"
                alt="Search"
                className="w-[20px] h-[20px] absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <img
                src="/icons/Command.svg"
                alt="Command"
                className="w-[32px] h-[20px] absolute right-3 top-1/2 transform -translate-y-1/2"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <button className="relative flex items-center justify-center w-[44px] h-[44px] border-[1.5px] border-[rgba(234,234,234,1)] rounded-full p-[10px]">
                <img
                  src="/icons/Frame.svg"
                  alt="Notifications"
                  className="w-[24px] h-[24px]"
                />
                <span className="absolute -top-0 right-0 flex items-center justify-center w-[12px] h-[12px] bg-[#FBBF24] text-[#202020] text-[10px] font-medium rounded-full px-[3px] py-[2px]">
                  3
                </span>
              </button>
              <button className="flex items-center justify-center w-[44px] h-[44px] border-[1.5px] border-[rgba(234,234,234,1)] rounded-full p-[10px]">
                <img
                  src="/icons/love.svg"
                  alt="Wishlist"
                  className="w-[24px] h-[24px]"
                />
              </button>
            </div>
            <div className="w-[1px] h-[40px] bg-[rgba(203,213,225,1)]"></div>
            <div className="flex items-center space-x-3">
              <div className="w-[40px] h-[40px] bg-[rgba(196,196,196,1)] rounded-full flex items-center justify-center text-white font-medium">
                SA
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold leading-[26px] text-[#1D1D1D]">
                  Shiraj Ahmed
                </span>
                <span className="text-[12px] font-normal leading-[14.65px] text-[#64748B]">
                  neurotic@taildo.com
                </span>
              </div>
              <img
                src="/icons/angle-small-down.svg"
                alt="Dropdown"
                className="w-[24px] h-[24px] cursor-pointer"
              />
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col m-[26px]">
          <div className="bg-white rounded-[8px] shadow flex flex-col h-full p-[20px]">
            <div className="flex flex-col gap-[12px]">
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[20px] font-semibold leading-[30px] text-[#0F172A]">
                    Model Library
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <img
                    src="/icons/Outline-plus-sm.svg"
                    alt="plus"
                    className="w-5 h-5"
                  />
                  <span className="text-[16px] font-semibold leading-[26px] text-white text-center">
                    Create New Model
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-[16px]">
                <div className="flex items-center bg-[#F9FAFB] rounded-md px-4 py-3 flex-1">
                  <img
                    src="/icons/search.svg"
                    alt="Search"
                    className="w-6 h-6 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search by Name, ID"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full bg-transparent outline-none text-[16px] font-normal leading-[26px] text-[#767676] pl-3"
                  />
                </div>
                <button className="flex items-center bg-[#F9FAFB] px-4 py-3 gap-2 rounded-md">
                  <img
                    src="/icons/filter.svg"
                    alt="Filter"
                    className="w-6 h-6"
                  />
                  <span className="text-[16px] font-normal leading-[26px] text-gray-700">
                    Filter
                  </span>
                </button>
                <button className="flex items-center bg-[#F9FAFB] px-4 py-3 gap-2 rounded-md">
                  <img src="/icons/Group.svg" alt="Date" className="w-6 h-6" />
                  <span className="text-[16px] font-normal leading-[26px] text-gray-700">
                    April 11 - April 24
                  </span>
                </button>
              </div>

              <div>
                <div className="w-full overflow-auto">
                  <div className="px-1 py-3 border-b-2 border-[#F3F3FD] grid grid-cols-7 gap-[18px] font-semibold text-[#202020] text-[16px] leading-[26px]">
                    {headers.map((header) => (
                      <div
                        key={header.key}
                        className="w-fit flex items-center gap-1 whitespace-nowrap cursor-pointer"
                        onClick={() => handleSort(header.key, header.sortable)}
                      >
                        {header.label}
                        {header.sortable && (
                          <img
                            src="/icons/arrows-down-up.svg"
                            alt="Sort"
                            width="16"
                            height="16"
                            className="cursor-pointer"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 overflow-auto divide-y divide-gray-200">
                    {currentData.map((row: any, index: any) => (
                      <div
                        key={index}
                        className="px-1 py-4 grid grid-cols-7 gap-[18px] text-[16px] leading-[26px] text-[#202020] border-b-2 border-[#F3F3FD]"
                      >
                        <div>
                          <p className="font-semibold text-[#1D1D1D]">
                            {row.modelName.name}
                          </p>
                          <p className="text-[14px] font-normal leading-[17px] text-[#767676]">
                            {row.modelName.id}
                          </p>
                        </div>
                        <div className="font-normal whitespace-nowrap">
                          {row.modelType}
                        </div>
                        <div className="font-normal whitespace-nowrap">
                          {row.description}
                        </div>
                        <div className="font-normal text-center whitespace-nowrap">
                          {row.createdOn}
                        </div>
                        <div className="font-normal text-center whitespace-nowrap">
                          {row.lastTrainedOn}
                        </div>
                        <div>
                          <span className="inline-flex text-center items-center justify-center w-[102px] h-[33px] px-[18px] py-[8px] gap-[6px] rounded-[6px] bg-[#DCFCE7] text-[#16A34A]">
                            {row.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-center cursor-pointer text-center w-[58px]">
                          <img
                            src={row.action}
                            alt="Action"
                            className="w-[20px] h-[20px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 flex items-center justify-between border-t border-gray-200">
                  <p className="text-[14px] text-[#475569]-500">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>{" "}
                    of <span className="font-medium">{totalItems}</span> results
                  </p>
                  <nav className="flex items-center space-x-2">
                    <div
                      className="w-[28px] h-[28px] p-2 rounded-full bg-[#DBEAFE] flex items-center justify-center cursor-pointer"
                      onClick={() => goToPage(currentPage - 1)}
                    >
                      <img
                        src="/icons/Vectorl.svg"
                        alt="Previous"
                        className="w-[12px] h-[12px]"
                      />
                    </div>
                    {paginationButtons.map((num) => (
                      <button
                        key={num}
                        onClick={() => goToPage(num)}
                        className={`w-[28px] h-[28px] rounded-full ${
                          currentPage === num
                            ? "bg-[#2563EB] text-white"
                            : "bg-white hover:border hover:border-gray-100 text-gray-700 hover:bg-gray-50"
                        } flex items-center justify-center`}
                      >
                        {num}
                      </button>
                    ))}
                    <div
                      className="w-[28px] h-[28px] rounded-full bg-[#DBEAFE] flex items-center justify-center cursor-pointer"
                      onClick={() => goToPage(currentPage + 1)}
                    >
                      <img
                        src="/icons/Vectorr.svg"
                        alt="Next"
                        className="w-[12px] h-[12px]"
                      />
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <CreateModelModal onClose={() => setIsModalOpen(false)} />
      )}

      <Toaster />
    </div>
  );
}

export default App;
