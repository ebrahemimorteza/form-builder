import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import formActions from "./../../store/actions/formActions";
import { history } from "./../../store/config";
import "./index.css";
import { Link } from "react-router-dom";

const CreateForm = () => {
	const [isOpen, setisOpen] = useState(false);
	const [formTitle, setFormTitle] = useState("");
	const [formNumber, setFormNumber] = useState("");
	const [questionType, setQuestionType] = useState("");
	const [iclass, setIclass] = useState("");
	const dispatch = useDispatch();
	const dispatch1 = useDispatch();
	const { data: formList} = useSelector((state) => state.form);
	useEffect(() => {
		dispatch(formActions.getUsers());
	}, [dispatch]);
	const { action } = useSelector((state) => state.form);
	const onQuestionTypeChange = (e) => {
		alert(e.target.value);
		setQuestionType(e.target.value);
	};

	const saveUser = () => {
		const formJson = {
			title: formTitle,
			number: formNumber,
		};
		dispatch(formActions.saveUser(formJson));
	};

	useEffect(() => {
		if (action === formActions.SAVE_USER_SUCCESS) {
			history.go(-1);
		}
	}, [action]);

	const { data: formList1, totalResponses } = useSelector((state) => state.form);

	useEffect(() => {
		console.log("forms", formList1);
		console.log("Response Count", totalResponses);
	},[dispatch1]);


	const handleInputChange = (event) => {
		const value = event.target.value;
		setFormNumber(value);
		console.log("formList"); // نمایش formList در کنسول
		console.log(formList); // نمایش formList در کنسول
		if (value.length === 11) {
		  const hasDuplicate = formList.map((form) => {
			// این قسمت را براساس ساختار داده‌های خود تغییر دهید
			return form.formJson.number === value;
		  });
	  
		  const duplicateIndex = hasDuplicate.findIndex((duplicate) => duplicate);
		  if (duplicateIndex !== -1) {
			const duplicateForm = formList[duplicateIndex];
			setIclass(duplicateForm['formJson']['idClass']);
			dispatch1(formActions.getForms());
			setisOpen(true);
			console.log('شماره تکراری وجود دارد');
			console.log('مقدار تکراری:', duplicateForm['formJson']['idClass']);
		  } else {
			alert('هیچ شماره تکراری وجود ندارد');
		  }
		}
	  };
	return (
		<main className="mt-[6rem] w-fit mx-auto m-6 flex flex-col gap-6">
    <form className="max-w-[30rem] max-sm:w-full max-sm:text-sm  p-4">
        <h4 className="p-3 bg-gradient-to-bl from-orange-500 to-orange-400 text-white rounded-xl shadow-md">
            همواره نظرات و پیشنهادات ارزنده شما ، باعث پیشرفت و خدمات رسانی بهتر ما بوده است. از این رو مشتاقانه منتظر ارسال ایده ها، پیشنهادات شما عزیزان هستیم</h4>
        <div className="w-full my-4">
            <label for="name">
                نام : </label>
            <input 	value={formTitle}
			onChange={(e) => setFormTitle(e.target.value)} name="name" className="rounded-xl bg-zinc-100 w-full mt-2 p-3 input-style  undefined" type="text" id="name" />
        </div>
        <div className="w-full my-4">
            <label for="number">
                شماره تماس  : </label>
            <input name="phonenumber" value={formNumber}
			onChange={handleInputChange} className="rounded-xl bg-zinc-100 w-full mt-2 p-3 input-style  undefined" type="number" id="number"/>
        </div>
	{isOpen ? (<div className="form-listing-container">
	{formList1.length <= 0 && (
		<p className="no-form-text">There is no form, please create one by pressing below 'create form' button.</p>
	)}
	{formList1.length > 0 && (
		<table className="form-list">
			<tbody>
				<tr>
					<th> عنوان </th>
					<th> ادرس </th>
					<th> ساخته شده </th>
					<th> کل انجام شده </th>
				</tr>
				{formList1.map((form, index) => {
					console.log(form)
					const title = form.formJson.title;
					const { url, date } = form;
					const formURL = window.location.protocol + "//" + window.location.host + "/form-response/" + url;
					if(iclass==form.formJson.idClass){
						console.log("---->")
						console.log(form.formJson)
						console.log(iclass)
						console.log("---->")
						return (
							<tr key={index}>
								<td>{title}</td>
								<td>
									<Link to={"/form-response/" + url}>{formURL} </Link>
								</td>
								<td>{form.formJson.date}</td>
								<td> {totalResponses[url] || 0}</td>
							</tr>
						);
					}else{
						return (
							<></>
						);
					}				
				})}
			</tbody>
		</table>
	)}
</div>): (<></>)}

    </form>
</main>
	);
};

export default CreateForm;

const itemEnum = {
	1: "text",
	2: "checkBox",
	3: "radio",
};
