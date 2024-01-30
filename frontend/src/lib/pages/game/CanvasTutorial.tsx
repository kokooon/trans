import { Component } from 'react';

class CanvasTutorial extends Component {
  componentDidMount() {
    this.draw();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  state = {
    y: 200, // Initial y position of the rectangle
  };

  draw() {
    const canvas = this.refs.canvas as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const height = 500;
    const width = 800;

    if (ctx)
    {
      const animate = () => {
        ctx.clearRect(0, 0, width, height); // Clear the canvas

        ctx.strokeStyle = 'black';
        ctx.strokeRect(5, 5, width - 10, height - 10);

        ctx.fillStyle = 'blue';
        ctx.fillRect(10, this.state.y, 20, 100);

        ctx.fillStyle = 'red';
        ctx.fillRect(width - 30, 200, 20, 100);

        // Repeat animation
        requestAnimationFrame(animate);
      };

      animate(); // Start the animation loop
    }
  }

  handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    const { y } = this.state;
    const deltaY = 10; // Increment for vertical movement

    if (key === 'ArrowUp') {
      this.setState({ y: y - deltaY }); // Move the rectangle up
    } else if (key === 'ArrowDown') {
      this.setState({ y: y + deltaY }); // Move the rectangle down
    }
  };

  render() {
    return (
      <div>
        <canvas ref="canvas" width={800} height={500}></canvas>
      </div>
    );
  }
}

export default CanvasTutorial;