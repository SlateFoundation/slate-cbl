const logTransition = (state) => {
  if (state.context.logTransition) {
    let current = state.value;

    if (typeof current === "object") {
      current = JSON.stringify(current);
    }
    if (state.changed) {
      console.groupCollapsed(
        `[#] <${state.machine.id}> received event ${state.event.type} and transitioned to ${current}`
      );
    } else {
      console.groupCollapsed(
        `[#] <${state.machine.id}> received event ${state.event.type} and remained in ${current}`
      );
    }
    console.log("event: ", state.event);
    console.log("state: ", state);
    console.log("machine: ", state.machine);
    console.log("context: ", state.context);
    console.groupEnd();
  }
};

export { logTransition };
