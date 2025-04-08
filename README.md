# Dynamic Forms with Corticon.js

Creating dynamic forms can be a complex and time-consuming process, even for experienced developers. However, with Corticon.js, dynamic forms can be created efficiently, leveraging contributions from both developers and non-developers. The framework-agnostic design pattern provided by Corticon.js ensures maximum reusability of form logic, reducing development time and effort.

Try Corticon.js rules-driven dynamic forms with the [Form Playground](https://corticon.github.io/dynamic-forms/).

---

## What Are Dynamic Forms?

While most frameworks can handle simple forms, dynamic forms introduce a higher level of complexity. Dynamic forms adapt to user input in real time, presenting only the relevant fields and questions based on prior responses. This is particularly useful in scenarios with hundreds of fields or complex rules, such as insurance claims or loan applications.

Dynamic forms present several challenges:
- **Rule Management**: Systematizing and managing a large number of rules in a single system while ensuring robust testing.
- **Rule Definition**: Allowing business users to define rules in a non-technical, descriptive manner without requiring programming expertise.
- **Frontend Integration**: Visualizing and rendering these rules as a form without requiring developers to have domain knowledge of the business processes.
- **Maintenance**: Implementing and testing changes quickly without introducing regressions.

Corticon.js addresses these challenges by providing a robust, rules-driven framework for creating and maintaining dynamic forms.

---

## Dynamic Forms with Corticon.js

Dynamic forms are just one of the many use cases for Corticon.js. The solution is built around a **model-view architecture**, where:
- The **model** is generated from the rules defined in Corticon.js Studio.
- The **view** is a generic UI component capable of rendering the instructions from the model. This component can be hosted in any web or mobile application.

Corticon.js provides a model-driven development interface called **Corticon.js Studio**, where users define business rules that dynamically modify input data based on specified conditions. These rules are then transpiled into a Decision Service JavaScript bundle, which drives the dynamic behavior of the form.

Traditionally, rules engines are used to automate decisions based on known data (e.g., calculating a loan rate based on an applicant's profile). With Corticon.js, the rules engine goes further by dynamically gathering data from the user, presenting additional prompts conditioned on prior responses, and determining when sufficient data has been collected to proceed.

This separation of concerns allows:
- **Rule Modelers** (e.g., business analysts or developers) to define the logic in Corticon.js Studio without requiring frontend expertise.
- **Frontend Developers** to focus on styling and rendering the form, starting from an open-source rendering template.

For example, in an insurance quoting form, Corticon.js ensures:
- **Efficiency**: Guides the user through the quoting process without asking irrelevant questions (e.g., skipping vehicle-related questions for renter's insurance).
- **Seamless User Experience**: Avoids unnecessary server calls for dynamic behavior, reducing the risk of user abandonment.
- **Data-Driven Decisions**: Dynamically evaluates user-provided data, pre-existing data (e.g., from a CRM), and live data from external endpoints to determine the next steps.
- **Separation of Logic and Rendering**: Maintains a clear distinction between the decision service logic (e.g., determining the content of prompts) and the rendering logic (e.g., how a dropdown looks and behaves).

---

## Getting Started

To help you build dynamic forms quickly, we provide a **form accelerator template** that includes:
1. **Base Corticon.js Rule Vocabulary**: A predefined vocabulary of UI definition components that can be rendered out of the box.
2. **Test Driver HTML Page**: A testing environment for form developers to experiment with and validate their forms.
3. **Preconfigured JavaScript Files**: These files act as the glue between the Decision Service and the frontend, translating rule vocabulary into actual HTML input types and behaviors.

---

## Key Features of Corticon.js Dynamic Forms

1. **Rules-Driven Design**: Define business rules in Corticon.js Studio to dynamically control the form's behavior.
2. **Framework-Agnostic**: The rendering component can be integrated into any web or mobile application.
3. **Separation of Concerns**: Decouples decision-making logic from UI rendering, enabling independent development and maintenance.
4. **Real-Time Adaptability**: Dynamically adjusts the form based on user input, pre-existing data, and external data sources.
5. **Non-Technical Rule Definition**: Allows business users to define rules in a user-friendly interface without requiring coding expertise.
6. **Reusable Logic**: Rules and logic can be reused across multiple forms and applications, reducing duplication and maintenance overhead.

---

## Example Use Case: Insurance Quoting Form

An optimal dynamic form for an insurance quoting process should:
- **Guide the User Efficiently**: Avoid wasting time on irrelevant questions (e.g., skipping vehicle-related questions for renter's insurance).
- **Minimize Abandonment**: Avoid frequent server calls for dynamic behavior, ensuring a smooth user experience.
- **Leverage Existing Data**: Use pre-existing data (e.g., from a CRM) to prefill fields and reduce user effort.
- **Maintain Clear Separation**: Keep rendering logic (e.g., how a dropdown looks) separate from decision logic (e.g., what options to display).

---

Corticon.js empowers developers and business users alike to create dynamic, rules-driven forms that are efficient, maintainable, and adaptable to changing business needs.
