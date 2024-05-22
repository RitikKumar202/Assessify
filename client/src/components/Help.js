import React, { Component } from 'react';


class Help extends Component {

    render() {
        return (
            <div className="help-container" >
                <div className="help-wrapper">
                    <h2>Using Website:</h2>
                    <div className="help-content">
                        <strong>Admins:</strong>
                        <ol>
                            <li>Begin by setting up an Admin account through the registration menu.</li>
                            <li>Upon successful registration, initiate the creation of a group.</li>
                            <li>Share the Group ID generated from the Group Details section with other students, enabling them to send group join requests effortlessly.</li>
                            <li>We can create new test from the Create a new Test button.</li>
                            <li>We can fill basic test details there and choose test type.</li>
                            <li>Opt for Test Type 3 for the convenience of uploading a PDF-style question paper. For other test types, questions can be added individually with allocated marks.</li>
                            <li>Once test is finished we can see test summary by clicking test Summary button from GroupDetails --&gt; Tests.</li>
                            <li>We can also see specifc students responses and evaluate if test is from <b> test type 2 (Fill Ups +MCQ)or 3 (Assignment type)</b>.</li>
                        </ol>

                        <strong>Students:</strong>
                        <ol>
                            <li>Register using a student account.</li>
                            <li>Send group join requests via the "Join a Group" button.</li>
                            <li>Enter the Group ID provided by the administrator.</li>
                            <li>Start a test by selecting a group and accessing the test list.</li>
                            <li>Choose the desired test to begin.</li>
                            <li>Avoid refreshing the page once the test starts to prevent attendance marking.</li>
                            <li>Note that once a test begins, it cannot be restarted.</li>
                            <li>Access responses once the test time elapses and evaluation is complete.</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }
}

export default Help;