/**
 * @returns {JSX.Element} A div element that renders as a mouse-following light effect.
 * @description A component that renders a background light effect which follows the cursor's movements.
 * @exports MouseLight
 */

document.onmousemove = (e) => {
    const light = document.querySelector('.mouse-light') as HTMLDivElement;
    if (light) {
        light.style.left = e.clientX + 'px';
        light.style.top = e.clientY + 'px';
    }
}
function MouseLight() {
    return (
        <div className="mouse-light hidden dark:block max-lg:!hidden fixed w-[1000px] h-[1000px] z-4 translate-[-50%] pointer-events-none rounded-full bg-[radial-gradient(circle,_rgba(36,105,255,0.1)_0%,_rgba(255,255,255,0)_70%)]"></div>
    );
};
export default MouseLight;