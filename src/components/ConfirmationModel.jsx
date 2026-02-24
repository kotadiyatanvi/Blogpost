import "./ConfirmationModel.css";
const ConfirmationModel = ({
  title,
  desc,
  onconfirm,
  onclose,
  confirmBtnText,
}) => {
  return (
    <div className="model-backdrop">
      <div className="model">
        <h2>{title}</h2>
        <p>{desc}</p>
        <div className="model-actions">
          <button className="btn-cancel" onClick={onclose}>
            Cancel
          </button>
          <button className="btn-delete" onClick={onconfirm}>
            {confirmBtnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModel;
