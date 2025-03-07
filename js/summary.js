function showTaskNumbers() {
  let priorities = [];
  let dates = [];
  if (tasks.length > 0) {
    document.getElementById("tasks_board").innerHTML = tasks.length;
    for (let indexTasks = 0; indexTasks < tasks.length; indexTasks++) {
      priorities.push(tasks[indexTasks].prio.trim());
      if (tasks[indexTasks].prio == "urgent") {
        dates.push(tasks[indexTasks].date);
      }
    }
    showurgentNumber(priorities);
    showClosestDate(dates);
    countStatusTasks();
  }
}

function showurgentNumber(priorities) {
  let urgentCount = 0;

  for (let indexUrgent = 0; indexUrgent < priorities.length; indexUrgent++) {
    if (priorities[indexUrgent] == "urgent") {
      urgentCount++;
    }
    document.getElementById("urgent").innerHTML = urgentCount;
  }
}

function showClosestDate(dates) {
  if (dates.length == 0) {
    return;
  } else {
    let sortedDates = dates.sort((a, b) => {
      return new Date(a) - new Date(b);
    });
    let closestDate = new Date(sortedDates[0]);
    let splitDate = sortedDates[0].split("-");
    let splitDay = splitDate[2];
    let splitYear = splitDate[0];
    document.getElementById("deadline").innerHTML = summaryDueDateInsert(closestDate, splitDay, splitYear);
  }
}

function countStatusTasks() {
  let statusAmount = [];
  for (let indexStatus = 0; indexStatus < tasks.length; indexStatus++) {
    statusAmount.push(tasks[indexStatus].status);
  }
  let count = statusAmount.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});
  insertStatusTasks(count);
}

function insertStatusTasks(count) {
  let count_to_do = document.getElementById("tasks_to_do");
  let count_done = document.getElementById("tasks_done");
  let count_progress = document.getElementById("tasks_progress");
  let count_feedback = document.getElementById("tasks_awaiting");
  if (count.todo != undefined) {
    count_to_do.innerHTML = count.todo;
  }
  if (count.done != undefined) {
    count_done.innerHTML = count.done;
  }
  if (count.progress != undefined) {
    count_progress.innerHTML = count.progress;
  }
  if (count.feedback != undefined) {
    count_feedback.innerHTML = count.feedback;
  }
}
