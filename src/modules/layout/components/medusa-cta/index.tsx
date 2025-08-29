import { Text } from "@medusajs/ui";

const MedusaCTA = () => {
  return (
    <Text className="flex txt-compact-small-plus items-center text-white">
      Built by
      <a
        href="https://havenfutures.com"
        target="_blank"
        rel="noreferrer"
        className="ml-2 mr-1.5"
      >
        <img
          src="https://havenfutures.com/Haven%20Futures.png"
          alt="Haven Futures Logo"
          className="h-6"
        />
      </a>
      <a
        href="https://havenfutures.com"
        target="_blank"
        rel="noreferrer"
        className="flex gap-x-1 handwritten-double-underline font-semibold"
      >
        <span style={{ color: "#55d485" }}>Haven</span>
        <span style={{ color: "#ffffff" }}>Futures</span>
      </a>
    </Text>
  );
};

export default MedusaCTA;
