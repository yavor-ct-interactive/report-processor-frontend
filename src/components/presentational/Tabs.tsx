import React, { useState } from "react";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      {/* Tab headers */}
      <div className="flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 -mb-px border-b-2 ${
              activeTab === index
                ? "border-blue-500 text-blue-500 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

// Example usage
export const TabsComponent = () => {
  const tabData = [
    { label: "Home", content: <p>Welcome to the Home tab.</p> },
    { label: "Profile", content: <p>Here is your profile.</p> },
    { label: "Settings", content: <p>Adjust your settings here.</p> },
  ];

  return (
    <div className="">
      <Tabs tabs={tabData} />
    </div>
  );
};

