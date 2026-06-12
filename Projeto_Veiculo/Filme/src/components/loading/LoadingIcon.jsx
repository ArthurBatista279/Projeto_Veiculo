import "./LoadingIcon.css";
import Loading from "../../assets/img/loading_gray.gif";

export const LoadingIcon = ({ showHide = false }) => {
  return (
    showHide &&
    <div className="loading">
      <img className="loading__image" src={Loading} alt="loading" />
    </div>
  );
};
