const logTransition = (state) => {
  if (state.context.logTransition) {
    console.groupCollapsed(
      `[#] <${state.machine.id}> transitioned to ${state.value}`
    );
    console.log("event: ", state.event);
    console.log("state: ", state);
    console.log("context: ", state.context);
    console.groupEnd();
  }
};

export { logTransition };
