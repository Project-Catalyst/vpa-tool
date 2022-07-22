<template>
  <b-message>
    <div class="content">
      <p><b>How it works</b><br /></p>
      <p>The vPA-tool is designed to work in parallel with the standard way (using the Google Sheet) in order to provide a better user experience and to better coordinate the vPA work. It is a community made tool, feedback is welcomed.</p>
      <ol>
        <li>Click on the "Start Process" button</li>
        <li>Enter your Full Name and email address.</li>
        <li>Choose either “I want to start the process from the beginning” or “I have a backup file to import” (see step 8)</li>
        <li>
          You will be redirected to the "Assessments list view".<br />
          From this page you can show/hide the list and select your chosen filters, by clicking ‘Choose Filters’. You can combine them in any way you like.
        </li>
        <li>Click on the ‘Next’ button to access to the “Review View”</li>
        <li>Make your review of the PA assessment click ‘next’ to see another assessment.
          <ol type="a" class="mt-0">
            <li>Read the assessment triplet on “Impact / Alignment”, “Feasibility” and “Clearity/Auditability”.</li>
            <li>Read the proposal and cross reference the PA assessment with the content of the proposal.</li>
            <li>Categorize them as either, "Excellent", "Good" or "Filtered Out", according to the PA Guidelines.</li>
            <li>Provide the PA with any positive or constructive criticism to help them continue to or in the future make better assessments (optional).</li>
          </ol>
        </li>
        <li>Repeat the process for all Assessments you wish to review</li>
        <li>When Complete - Click "Export CSV".
          <ol type="a" class="mt-0">
            <li>This export can be used to ‘save’/backup your reviews and import them into the tool in another location or cleared browser.</li>
          </ol>
        </li>
        <li>Submit your final work using <a href="https://forms.gle/TxbXUQDzNEwP3DFM7" target="_blank">this form</a> and upload the CSV you just exported there.</li>
      </ol>
      <p><b>Useful resources</b><br /></p>
      <p>
        <a href="https://bit.ly/vCA_Guide" target="_blank">Veteran Proposal Assessor Guide</a><br />
        <a href="https://bit.ly/Catalyst-PA-Guide" target="_blank">Proposal Assessor Guide</a><br />
        <a href="https://docs.google.com/spreadsheets/d/14YgEynmhbUs_VVMBfwDOQjwq9HMt3yZSgqfAKMGbkvk/edit#gid=308336039" target="_blank">F9 Similarity Analysis</a><br />
        <a href="https://bit.ly/Fund-9-PA-Clusters" target="_blank">F9 Cluster Analysis</a><br />
      </p>
    </div>
  </b-message>
</template>

<script>
export default {
  name: 'Instructions',
}
</script>
