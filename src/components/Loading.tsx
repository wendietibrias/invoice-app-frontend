import { ILoadingProps} from "../interfaces/componentPropsInterface";
import {BounceLoader} from "react-spinners";
const Loading = ({ type,isLoading } : ILoadingProps) => {


    if(type === "in modal") {

    }

    if(type === "wrapper") {
        return (
            <div className="loading-wrapper">
                <BounceLoader
                   loading={isLoading}
                   color={"#fff"}
                   size={70}
                />
                <h4>Load data...</h4>
            </div>
        )
    }

    return null;
}

export default Loading;