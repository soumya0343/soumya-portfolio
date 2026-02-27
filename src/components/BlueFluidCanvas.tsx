import "./BlueFluidCanvas.css";

const BlueFluidCanvas = () => {
  return (
    <div className="blue-fluid-canvas">
      <iframe
        src="/fluid-art.html?palette=glacier"
        className="blue-fluid-canvas__iframe"
        title="Blue Fluid Art"
        loading="lazy"
      />
    </div>
  );
};

export default BlueFluidCanvas;
