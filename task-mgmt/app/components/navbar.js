export default function Navbar() {
    return (
        <nav className="container-fluid header border_custom">
            <div className="row align-items-center">
                <div className="logo col-3">
                    <span className="logo">QUESTIFY</span>
                </div>
                <div className="login_form_wrapper col-6 ms-auto">
                    <form action="" method="" className="d-flex my-0">
                        <input type="text" id="username" name="username" placeholder="username" className="border_custom login_form ms-auto" />
                        <input type="password" id="password" name="password" placeholder="password" className="border_custom login_form mx-4" />
                        <input type="submit" value="login" className="border_custom button_style" />
                    </form>
                </div>
            </div>
        </nav>
    );
  }
  