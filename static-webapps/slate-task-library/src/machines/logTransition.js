const logTransition = (state) => {
  if (state.context.logTransition) {
    let current = state.value;

    if (typeof current === "object") {
      current = JSON.stringify(current);
    }
    console.groupCollapsed(
      `[#] <${state.machine.id}> transitioned to ${current}`
    );
    console.log("event: ", state.event);
    console.log("state: ", state);
    console.log("context: ", state.context);
    console.groupEnd();
  }
};

export { logTransition };
