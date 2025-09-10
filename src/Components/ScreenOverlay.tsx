
/**
 * @param {ScreenOverlayProps} props The props for the ScreenOverlay component.
 * @param {boolean} props.active Boolean to toggle the visibility of the overlay.
 * @param {function():void} [props.disable] Callback function to hide/disable the overlay.
 * @returns {JSX.Element} A div element that renders as a full-screen overlay or backdrop.
 * @description A React component that acts as a full-screen overlay or backdrop to cover other content on the screen.
 * @exports ScreenOverlay
 */


interface ScreenOverlayProps {
    active: boolean;
    disable?: () => void;
}

function ScreenOverlay({ active, disable} : ScreenOverlayProps) {
    return (
        <div data-active={String(active)} className="
        fixed
        inset-0
        w-screen
        h-screen
        pointer-events-none
        bg-black/0
        z-5
        data-[active=true]:bg-gray-800/25
        data-[active=true]:pointer-events-auto
        data-[active=true]:backdrop-blur-sm
        transition-all
        duration-200
        ease-in-out
        "
        onClick={disable}
        ></div>
    );
}
export default ScreenOverlay;