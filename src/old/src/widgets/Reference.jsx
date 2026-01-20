import loadingImg from "@/assets/img/loading.png";

const reference = () => {
  return (
    <div className="min-h-screen w-full bg-slate-200">
      <div className="w-4/5 mx-auto bg-white p-10">
        <img className="animate-spin" src={loadingImg} alt="" />
      </div>
    </div>
  );
};

export default reference;
