'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLogin } from '../contexts/loginContext.js'

export default function TasksPage() {
  const { loggedIn } = useLogin();
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) {
      router.push('/');
    }
  }, [loggedIn, router]);

  return (
    <div className="container my-3">
    <div className="row">
      <div className="col-md-3">
        <div className="d-flex w-100 mb-2">
          <button className="btn btn-outline-secondary me-2">Filter</button>
          <button className="btn btn-outline-secondary">Sort</button>
        </div>
      </div>
      <div className="col-md-9">
        <div className="lvl-panel border_custom mb-3">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="progress flex-grow-1" style={{height: 30 + 'px'}}>
                <div className="progress-bar level-bar" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">40%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="task_wrapper border_custom">
          <div className="task active p-4">
            <h1>Task 1</h1>
            <p>lorem ispum</p>
          </div>
          <div className="task p-4">
            <h1>Task 2</h1>
            <p>lorem ispum</p>
          </div>
          <div className="task p-4">
            <h1>Task 3</h1>
            <p>lorem ispum</p>
          </div>
        </div>
      </div>
      <div className="col-md-9 task_content_wrapper d-flex flex-column flex-grow-1 border_custom p-3">
        <div className="task_edit ms-auto">
          <button className="border_custom button_style">
            <i className="bi bi-trash"></i> edit
          </button>
        </div>

        <div className="task_content mx-auto">
          <h5 className="task_title text-center mt-3">Task 1</h5>
          <p className="task_text text-center mt-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ornare  sed dui ultricies aliquam. Praesent malesuada diam vitae eros pulvinar,  sit amet ornare sapien facilisis. In hac habitasse platea dictumst.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent in tristique leo. Ut et sapien viverra,  pellentesque nisl vitae, posuere ligula. Donec quam mauris, ullamcorper  in mollis at, porta sed justo. Nulla at mattis nibh, ultrices euismod  metus. Nullam magna mi, blandit nec odio auctor, eleifend laoreet velit. Sed non eros nunc. Praesent mi lacus, sollicitudin id lacus a, vehicula mattis tellus. Quisque at orci nibh. Sed ornare diam diam, sit amet  dictum leo ullamcorper vitae. Mauris luctus sit amet nulla sit amet  eleifend.
          </p>
        </div>

        <div className="d-flex ms-auto gap-2 mt-auto">
          <button className="border_custom button_style">
            <i className="bi bi-trash"></i> delete
          </button>
          <button className="border_custom button_style">
            <i className="bi bi-check"></i> done
          </button>
        </div>
      </div>
    </div>
    <div className="input_wrapper text-end mt-2">
      <input type="button" value="New Task" className="border_custom button_style"/>
    </div>
  </div>
  );
}