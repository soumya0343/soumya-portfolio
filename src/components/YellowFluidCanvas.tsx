import "./YellowFluidCanvas.css";

const YellowFluidCanvas = () => {
  return (
    <div className="yellow-fluid-canvas">
      <iframe
        src="/fluid-art.html?palette=jungle"
        className="yellow-fluid-canvas__iframe"
        title="Yellow Fluid Art"
      />
    </div>
  );
};

export default YellowFluidCanvas;
