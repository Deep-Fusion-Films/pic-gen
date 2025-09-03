import { RxCross1 } from "react-icons/rx";

export default function ServerSettings({showServerSettings, setShowServerSettings}:{showServerSettings:any, setShowServerSettings:any}) {

const handleCloseServerSettings = () => {
    return (
        setShowServerSettings(!showServerSettings)
    )
}


  return (
    <>
      <section className="w-70 bg-black border absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg">
        <div className="bg-white flex justify-end p-1">
          <RxCross1 onClick={handleCloseServerSettings} className="hover:cursor-pointer" />
        </div>
        <form className="p-4" action="">
          <div className="flex flex-col">
            <label className="text-white display-block" htmlFor="settings">
              ComfyUI Url
            </label>
            <input
              className="border border-white bg-white"
              id="settings"
              type="text"
            />
          </div>
          <div className="flex justify-end mt-2">
            <button onClick={handleCloseServerSettings} className="bg-white border px-1 uppercase active:text-white active:bg-gray-500 hover:cursor-pointer">ok</button>
          </div>
        </form>
      </section>
    </>
  );
}
