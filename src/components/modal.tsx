import { Dialog, Transition } from "@headlessui/react";
import React, { Dispatch, Fragment, SetStateAction, useState } from "react";

type ModalProps = {
  title?: string;
  children?: React.ReactNode;
  state: [boolean, Dispatch<SetStateAction<boolean>>];
  // onClose: (value?: boolean) => void;
};

export const Modal: React.FC<ModalProps> = ({ children, state }) => {
  const [isOpen, setIsOpen] = state;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        onClose={() => setIsOpen(false)}
        className="relative z-10">
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease=in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        {/* Content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full dark:text-white">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              {children}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
