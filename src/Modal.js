import React from "react";
import Profiles from "./Profiles";

const Modal = () => {
  return (
    <div
      id="popup-modal"
      tabindex="-1"
      class=" overflow-y-auto overflow-x-hidden fixed top-200 right-200 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative p-4 w-full max-w-md max-h-full top-190 left-531">
        <Profiles />
      </div>
    </div>
  );
};

export default Modal;
