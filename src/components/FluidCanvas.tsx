import "./FluidCanvas.css";

const FluidCanvas = () => {
  return (
    <div className="fluid-canvas">
      <iframe
        src="/fluid-art.html"
        className="fluid-canvas__iframe"
        title="Fluid Art"
      />
    </div>
  );
};

export default FluidCanvas;
