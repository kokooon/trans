import { Component } from 'react';

function clamp(x: number, _min: number, _max: number)
{
  return (Math.max(Math.min(x, _max), _min))
}

class CanvasTutorial extends Component {
  componentDidMount() {
    this.draw();
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  state = {
    y: 200, // Initial y position of the rectangle

    mov_down: false,
    mov_up: false,
    inertie: 0,

    yMin: 10,
    yMax: 390,

  };

  draw() {
    const canvas = this.refs.canvas as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const height = 500;
    const width = 800;

    if (ctx)
    {
      const animate = () => {

        if (this.state.mov_up === true)
        {
          this.state.inertie += 1;
          //this.state.y -= 10
        }
        if (this.state.mov_down === true)
        {
          this.state.inertie -= 1;
          //this.state.y += 10
        }
        if (this.state.mov_up === false && this.state.mov_down === false)
        {
          if (this.state.inertie < 0)
            this.state.inertie += 0.5;
            if (this.state.inertie > 0)
            this.state.inertie -= 0.5;
        }
        this.state.inertie = clamp(this.state.inertie, -10, 10)

        this.state.y = clamp(this.state.y - this.state.inertie, this.state.yMin, this.state.yMax)
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
    if (event.key == 'ArrowUp') {
      this.state.mov_up = true;
    } else if (event.key == 'ArrowDown') {
      this.state.mov_down = true;
    }
  }

  handleKeyUp = (event: KeyboardEvent) => {
    if (event.key == 'ArrowUp') {
      this.state.mov_up = false;
    } else if (event.key == 'ArrowDown') {
      this.state.mov_down = false;
    }
  }

  /*
  handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    const { y } = this.state;
    const deltaY = 10; // Increment for vertical movement
    const minY = 10; // Minimum y position (top boundary)
    const maxY = 390; // Maximum y position (bottom boundary)

    if (key === 'ArrowUp' && y > minY) {
      this.setState({ y: y - deltaY }); // Move the rectangle up
    } else if (key === 'ArrowDown' && y < maxY) {
      this.setState({ y: y + deltaY }); // Move the rectangle down
    }
  };
  */

  render() {
    return (
      <div>
        <canvas ref="canvas" width={800} height={500}></canvas>
      </div>
    );
  }
}

export default CanvasTutorial;