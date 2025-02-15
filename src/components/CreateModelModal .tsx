import React, { useState, ChangeEvent } from "react";
import toast from "react-hot-toast";

interface CreateModelModalProps {
  onClose: () => void;
}

interface FormData {
  modelName: string;
  modelType: string;
  llm: string;
  modelDescription: string;
}

const CreateModelModal: React.FC<CreateModelModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    modelName: "",
    modelType: "",
    llm: "",
    modelDescription: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const validations: Partial<Record<keyof typeof formData, string>> = {
      modelDescription: "Add Description",
      llm: "Select LLM",
      modelType: "Select Model Type",
      modelName: "Add Model Name",
    };

    const errors = Object.keys(validations)
      .filter((key) => !formData[key as keyof typeof formData])
      .map((key) => validations[key as keyof typeof formData]!);

    if (errors.length) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    console.log("Collected Model Data:", formData);
    toast.success("Model data collected successfully! Check console.");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="w-full max-w-[439px] bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center px-[20px] py-[16px] border-b-[1.5px] border-[#E4E6F6]">
          <h2 className="text-[#2C2C2C] font-semibold text-[20px]">
            Create New Model
          </h2>
          <div
            className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
            onClick={onClose}
          >
            <img
              src="/icons/Icon.png"
              alt="Close"
              className="w-[12px] h-[12px]"
            />
          </div>
        </div>
        <div className="p-[20px] space-y-5">
          <div>
            <label className="text-[#202020] font-normal text-[14px]">
              Model Name
            </label>
            <input
              type="text"
              name="modelName"
              placeholder="Enter Model Name"
              value={formData.modelName}
              onChange={handleInputChange}
              className="w-full border border-[#C7C7C7] rounded-[6px] px-[14px] py-[11px] mt-1 text-[14px] text-[#202020] outline-none"
            />
          </div>

          <div>
            <label className="text-[#202020] font-normal text-[14px]">
              Model Type
            </label>
            <select
              name="modelType"
              value={formData.modelType}
              onChange={handleInputChange}
              className="w-full border border-[#C7C7C7] rounded-[6px] px-[14px] py-[11px] mt-1 text-[14px] text-[#202020] outline-none"
            >
              <option value="">Select</option>
              <option value="Extraction">Extraction</option>
            </select>
          </div>
          <div>
            <label className="text-[#202020] font-normal text-[14px]">
              LLM
            </label>
            <select
              name="llm"
              value={formData.llm}
              onChange={handleInputChange}
              className="w-full border border-[#C7C7C7] rounded-[6px] px-[14px] py-[11px] mt-1 text-[14px] text-[#202020] outline-none"
            >
              <option value="">Select</option>
              <option value="Neural">Neural (recommended)</option>
            </select>
          </div>
          <div>
            <label className="text-[#202020] font-normal text-[14px]">
              Model Description
            </label>
            <textarea
              name="modelDescription"
              placeholder="Enter Model Description"
              value={formData.modelDescription}
              onChange={handleInputChange}
              className="w-full border border-[#C7C7C7] rounded-[6px] px-[14px] py-[11px] mt-1 text-[14px] text-[#202020] outline-none resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="flex-1 px-[12px] py-[5px] bg-[#E7E6FA] text-[#4F46E5] rounded-[10px] text-center"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="flex-1 px-[12px] py-[5px] bg-[#4F46E5] text-white rounded-[10px] text-center"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModelModal;
