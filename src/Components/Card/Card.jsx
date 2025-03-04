export default function Card({ title, icon: Icon, value, percentage }) {
  return (
    <div className="card custom-box border-0 bg-gradient-custom-div py-3 h-100">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-5">
          <h5 className="card-title fw-lightBold">{title}</h5>
          <Icon className="fs-2" />
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <h2 className="card-text text-center mb-0 fw-lightBold">{value}</h2>
          <p className="card-text text-center mb-0">{percentage}</p>
        </div>
      </div>
    </div>
  );
}
