import React from "react";
import { helix } from "ldrs";
import { hourglass } from "ldrs";

interface LoadingProps {
  size?: string;
  color?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = "80", // Default size set to 80
  color = "#000000", // Default color set to black
}) => {
  helix.register();

  return (
    <div className="w-full flex justify-center h-full pt-[20%] pb-10 items-center">
      <l-helix
        size={size}
        stroke-length="0.15"
        bg-opacity="0.1"
        speed="1.4"
        color={color}
      ></l-helix>
    </div>
  );
};

export const SecondaryLoading: React.FC<LoadingProps> = ({
  size = "80", // Default size set to 80
  color = "#000000", // Default color set to black
}) => {
  hourglass.register();

  return (
    <div className="w-full flex justify-center h-full pt-[20%] pb-10 items-center">
      <l-hourglass
        size={size}
        stroke-length="0.15"
        bg-opacity="0.1"
        speed="1.4"
        color={color}
      ></l-hourglass>
    </div>
  );
};
