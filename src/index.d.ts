import * as React from "react";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
declare module "react-modal-promise" {
  export type ModalTimeout = {
    enter: number;
    exit: number;
  };

  export type InjectedModalProps<Result> = {
    open: boolean;
    timeout: ModalTimeout;
    onClose: (result: Result) => void;
  };

  interface CreateModal {
    <T extends InjectedModalProps<Result>, Result = boolean>(
      Component: React.ComponentType<T>,
      options?: {
        timeout?: ModalTimeout;
      }
    ): (props: Omit<T, "open" | "onClose" | "timeout">) => Result;
  }

  export const createModal: CreateModal;

  const PromiseModal: React.SFC<{}>;
  export default PromiseModal;
}
