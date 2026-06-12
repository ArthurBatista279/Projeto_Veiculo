import "./Alerta.css";
import Swal from "sweetalert2";

export const Alerta = ({
  title,
  text,
  icon,
  showCancelButton = null,
  confirmButtonText = null,
  cancelButtonText = null,
  confirmButtonColor = "#3085d6",
  cancelButtonColor = "#d33",
}) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: showCancelButton,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    confirmButtonColor: confirmButtonColor,
    cancelButtonColor: cancelButtonColor,
  });
};

export default Alerta;
