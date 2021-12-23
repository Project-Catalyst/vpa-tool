<template>
  <b-message>
    <div class="content">
      <p><b>How it works</b><br /></p>
      <p>The vCA-tool is designed to work in parallel with the standard way (using the Google Sheet) in order to provide a better user experience and to better coordinate the vCA work. It is a community made tool, feedback is welcomed.</p>
      <ol>
        <li>Click on the "Start Process" button</li>
        <li>Enter your Full Name and email address.</li>
        <li>Choose either “I want to start the process from the beginning” or “I have a backup file to import” (see step 8)</li>
        <li>
          You will be redirected to the "Assessments list view".<br />
          From this page you can show/hide the list and select your chosen filters, by clicking ‘Choose Filters’. You can combine them in any way you like.
        </li>
        <li>Click on the ‘Next’ button to access to the “Review View”</li>
        <li>Make your review of the CA assessment click ‘next’ to see another assessment.
          <ol type="a" class="mt-0">
            <li>Read the assessment triplet on “Impact / Alignment”, “Feasibility” and “Clearity/Auditability”.</li>
            <li>Read the proposal and cross reference the CA assessment with the content of the proposal.</li>
            <li>Categorize them as either, "Excellent", "Good" or "Filtered Out", according to the CA Guidelines.</li>
            <li>Provide the CA with any positive or constructive criticism to help them continue to or in the future make better assessments (optional).</li>
          </ol>
        </li>
        <li>Repeat the process for all Assessments you wish to review</li>
        <li>When Complete - Click "Export CSV".
          <ol type="a" class="mt-0">
            <li>This export can be used to ‘save’/backup your reviews and import them into the tool in another location or cleared browser.</li>
          </ol>
        </li>
        <li>Upload the final export to Google Sheet, change the share settings to "Anyone with the link".</li>
        <li>Submit your final work using <a href="https://docs.google.com/forms/d/e/1FAIpQLSc5hWW3Wlsl-RAjLMWuaIcFYesG7JdnHBlRQXPtPY-PHoDdow/viewform" target="_blank">this form</a></li>
      </ol>
      <p><b>Useful resources</b><br /></p>
      <p>
        <a href="https://docs.google.com/document/d/1vHapUV1LHM4cb2375V99oM32xJ-wj_XoN-DYcvKEk0A/edit?usp=sharing" target="_blank">Assess QA (Quality Assurance) Stage</a><br />
        <a href="https://docs.google.com/document/d/1g-iZhDlKhUBZkui1uv8NVNfJC4oVD3JtR-P6Fue7XPU/edit" target="_blank">Community Advisor Assessment Guide</a><br />
      </p>
    </div>
  </b-message>
</template>

<script>
export default {
  name: 'Instructions',
}
</script>
