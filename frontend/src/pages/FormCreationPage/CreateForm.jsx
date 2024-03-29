import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import "./CreateForm.css";
import { useDispatch, useSelector } from "react-redux";
import formActions from "./../../store/actions/formActions";
import { history } from "./../../store/config"; 
import { DatePicker } from "jalaali-react-date-picker";
import "jalaali-react-date-picker/lib/styles/index.css";
import moment from "moment-jalaali";

const CreateForm = () => {
	const [formBody, setFormBody] = useState([]);
	const [formTitle, setFormTitle] = useState("تمرین سیستم عامل");
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState([]);
	const [questionType, setQuestionType] = useState(0);
	const [questionType2, setQuestionType2] = useState("");
	const [addQuestionModalVisible, setAddQuestionModalVisible] = useState(false);
	const { data: formList} = useSelector((state) => state.form);
	const dispatch = useDispatch();

	const [selectedDate, setSelectedDate] = useState(null);

	const handleDateChange = (date) => {
		const jalaaliDate = moment(date).format("jYYYY/jMM/jDD");
		// const today = moment().format("jYYYY/jMM/jDD");
	  setSelectedDate(jalaaliDate);
	};
  

	useEffect(() => {
		dispatch(formActions.getClasses());
	}, [dispatch]);

	const { action } = useSelector((state) => state.form);

	const addQuestion = () => {
		setAddQuestionModalVisible(true);
	};

	const addNewQuestion = () => {
		setAddQuestionModalVisible(false);
		let formBodyArr = [...formBody];
		let questionObj = {
			id: formBodyArr.length + 1,
			type: questionType,
			question: question,
			options: options,
		};
		formBodyArr.push(questionObj);
		setFormBody(formBodyArr);
		resetQuestionModal();
	};

	const onQuestionTypeChange = (e) => {
		setQuestionType(e.target.value);
	};
	const onQuestionTypeChange2 = (e) => {
		setQuestionType2(e.target.value);
	};
	const questionInputChange = (e) => {
		setQuestion(e.target.value);
	};

	const optionInputChange = (e) => {
		let rawOptions = e.target.value;
		let optionsArr = [...rawOptions.trim().split("\n")];
		optionsArr = optionsArr.filter((item) => !!item);
		setOptions(optionsArr);
	};

	const saveForm = () => {
		alert(selectedDate);
		const formJson = {
			title: formTitle,
			body: formBody,
			date: selectedDate,
			idClass:questionType2
		};
		dispatch(formActions.saveForm(formJson));
	};

	const resetQuestionModal = () => {
		setOptions([]);
		setQuestionType(0);
		setQuestion("");
	};

	const cancelNewQuestion = () => {
		resetQuestionModal();
		setAddQuestionModalVisible(false);
	};

	useEffect(() => {
		if (action === formActions.SAVE_FORM_SUCCESS) {
			history.go(-1);
		}
	}, [action]);

	return (
		<div className="container form-container" style={{display:"contents"}}>
			<div className="form-header">
				<input
					type="text"
					placeholder="عنوان فرم"
					className="form-title"
					value={formTitle}
					onChange={(e) => setFormTitle(e.target.value)}
				/>
				<div className="select-question-type-container">
				انتخاب گروه کلاس:
				{formList.length > 0 && (
				<select className="select-question-type" onChange={(e) => onQuestionTypeChange2(e)}>			
					{formList.map((form, index) => {
						const title = form.formJson.title;
						const { url, date } = form;
						return (
							<option key={index} value={url}>{title}</option>
						);
					})};
					</select>
					)}
			</div>
			<div>
			<DatePicker 

			  selected={selectedDate}
			  onChange={handleDateChange}
			  placeholder="تاریخ"
			/>
		  </div>
			</div>
			<div className="form-body">
				{formBody.map((que, index) => {
					return (
						<React.Fragment key={index}>
							<p className="question"> {`${que.id}. ${que.question}`} </p>
							{que.type == "1" && (
								<div key={que.id}>
									<textarea
										className={"question-text-input question-text-input-" + que.id}
										cols="60"
										rows="4"
										placeholder="لطفا پاسخ خود را وارد کندی"
										value={""}
										readOnly={true}
									/>
								</div>
							)}
							{que.type == "2" && (
								<div key={que.id}>
									{que.options.map((opn, index) => {
										return (
											<div className={`option checkBox`} key={index}>
												<input
													type="checkbox"
													value={opn}
													key={index}
													checked={false}
													readOnly={true}
													className={`optionInput answer-checkbox-${que.id}-${index}`}
												/>
												{opn}
											</div>
										);
									})}
								</div>
							)}

							{que.type == "3" && (
								<div key={que.id}>
									{que.options.map((opn, index) => {
										return (
											<div className={`option radio `} key={index}>
												<input
													type="radio"
													value={opn}
													key={index}
													checked={false}
													readOnly={true}
													name={`answer-radio-${que.id}`}
													className={`optionInput answer-radio-${que.id}-${index}`}
												/>
												{opn}
											</div>
										);
									})}
								</div>
							)}
						</React.Fragment>
					);
				})}
			</div>
			<div className="form-footer">
				<button className="add-question-btn btn" onClick={() => addQuestion()}>
					Add Question
				</button>
				<button className="save-form-btn btn" onClick={() => saveForm()}>
					Save
				</button>
			</div>

			<Modal isOpen={addQuestionModalVisible}>
				<div className="new-question-container">
					<div className="new-question-header">
						Enter question:
						<input
							type="text"
							placeholder="Enter your question"
							className="new-question-input"
							value={question}
							onChange={(e) => questionInputChange(e)}
						/>
					</div>
					<div className="new-question-body">
						<div className="select-question-type-container">
							Select the answer type:
							<select className="select-question-type" onChange={(e) => onQuestionTypeChange(e)} defaultValue={0}>
								<option value="0" hidden>
									--Select--
								</option>
								<option value="1"> Text </option>
								<option value="2"> Checkbox </option>
								<option value="3"> Radio </option>
							</select>
						</div>
						<div className="answer-container">
							{questionType > 1 && (
								<>
									Enter Options (line seperated):
									<textarea
										className="options-input"
										cols="60"
										rows="4"
										placeholder="Enter your options here"
										onChange={(e) => optionInputChange(e)}
									/>
								</>
							)}
						</div>
					</div>
					<div className="add-new-question-btn-container">
						<button
							className="add-new-question-btn btn"
							onClick={() => addNewQuestion()}
							disabled={questionType <= 0 || question == "" || (questionType > 1 && options.length <= 0)}
						>
							Add
						</button>
						<button className="cancel-new-question-btn btn" onClick={() => cancelNewQuestion()}>
							خروج
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default CreateForm;

const itemEnum = {
	1: "text",
	2: "checkBox",
	3: "radio",
};
