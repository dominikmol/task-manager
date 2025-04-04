import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="container main">
      <div className="border_custom logo">
        <span>QUESTIFY</span>
      </div>
      <div className="main_wrapper border_custom d-flex align-items-center mx-auto">
        <div className="login_form_wrapper mx-auto">
        <div className="input_wrapper d-flex align-items-center">
          <input type="text" name="username" id="username" className="border_custom login_form" placeholder="username" />
        </div>
        <div className="input_wrapper d-flex align-items-center my-4">
          <input type="email" name="email" id="email" className="border_custom login_form" placeholder="email" />
        </div>
        <div className="input_wrapper d-flex align-items-center">
          <input type="password" name="password" id="password" className="border_custom login_form" placeholder="password" />
        </div>
        <div className="input_wrapper text-center mt-4">
          <input type="submit" value="register" className="border_custom button_style" />
        </div>
        </div>
      </div>
    </div>
  );
}
