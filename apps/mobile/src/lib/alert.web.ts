import type { AlertButton, AlertOptions } from "react-native";
import Swal from "sweetalert2";

import { colors } from "@/theme";

export const Alert = {
  alert(
    title: string,
    message?: string,
    buttons: AlertButton[] = [{ text: "OK" }],
    options?: AlertOptions,
  ): void {
    if (buttons.length > 2) {
      throw new Error("Web alerts support at most two buttons");
    }

    const cancel = buttons.find((button) => button.style === "cancel");
    const actions = buttons.filter((button) => button !== cancel);
    const confirm = actions[0] ?? cancel;
    const secondary = cancel && cancel !== confirm ? cancel : actions[1];

    void Swal.fire({
      titleText: title,
      text: message,
      confirmButtonText: confirm?.text ?? "OK",
      confirmButtonColor:
        confirm?.style === "destructive" ? colors.danger : colors.primary,
      showCancelButton: Boolean(secondary),
      cancelButtonText: secondary?.text ?? "Anuluj",
      cancelButtonColor:
        secondary?.style === "destructive" ? colors.danger : colors.textMuted,
      background: colors.surface,
      color: colors.text,
      backdrop: colors.backdrop,
      // SweetAlert2's automatic body height collapses the React Native web root.
      heightAuto: false,
      allowOutsideClick: options?.cancelable ?? false,
      allowEscapeKey: options?.cancelable ?? false,
      reverseButtons: Boolean(secondary),
      showClass: { popup: "", backdrop: "", icon: "" },
      hideClass: { popup: "", backdrop: "", icon: "" },
      willOpen: () => {
        const container = Swal.getContainer();
        if (container) container.style.backdropFilter = "blur(6px)";
      },
    })
      .then((result) => {
        if (result.isConfirmed) confirm?.onPress?.();
        else if (result.dismiss === Swal.DismissReason.cancel)
          secondary?.onPress?.();
        else options?.onDismiss?.();
      })
      .catch((error: unknown) =>
        console.error("Unable to display alert", error),
      );
  },
};
