import { Link } from "react-router-dom";
import "./Modal.css";
import { IoMdClose } from "react-icons/io";

const Modal = ({
  show,
  onClose,
  children,
  path,
  btnName,
  heading,
  handleClickAction,
}) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div
          className="modal-content"
          onClick={(event) => event.stopPropagation()}
        >
          {heading && (
            <div className="modal-header d-flex align-items-center justify-content-between">
              <h5 className="modal-title">{heading}</h5>
              <IoMdClose className="fs-3 cursor-pointer" onClick={onClose} />
            </div>
          )}
          <div className="modal-body text-center fw-lightBold mb-4 fs-5">
            {children}
          </div>
          {btnName && (
            <div className="modal-footer justify-content-center">
              <Link to={path} className="text-decoration-none">
                <button
                  className="signup-now py-2 px-3 fw-lightBold mb-0 h-auto"
                  onClick={handleClickAction}
                >
                  {btnName}
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
