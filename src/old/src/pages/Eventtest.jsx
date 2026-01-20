import { useEffect } from "react";
import axios from "axios";
import { useUser } from "@/data/api";

const Eventtest = () => {
  const { userData } = useUser();
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const joinEventHandler = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/events/3/users/${userData.user_id}/create?event_id=3&user_id=${userData.user_id}`,
        {},
        {
          withCredentials: true,
          headers: {
            Accept: "application/json", // 添加 Accept header
          },
        }
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  //   const eventCreateHandler = () => {
  //     axios
  //       .post("https://jsonplaceholder.typicode.com/todos", {
  //         title: "foo",
  //         completed: false,
  //       })
  //       .then((res) => console.log(res));
  //   };

  return (
    <div className="mt-15 xl:mt-19 w-full ">
      <button onClick={joinEventHandler}>join the event</button>
    </div>
  );
};

export default Eventtest;
