"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const internals = {
    COMMENT_LOAD_NUMBER: -1,
    INJECT_INTERNAL_VARS: true,
    NO_INTERNAL_VARS: false,
    DEL_NEW_COMMENT_TIMEOUT: 30,
    GARBAGE_REHEARSAL_CLEANUP_MINUTES: 5,
    GARBAGE_SCRIPT_CLEANUP_MINUTES: 30,
    VAR_IS_EFFICIENT: "yes",
    VAR_NOT_EFFICIENT: "no",
    VISI_FOR_NOBODY: "NOBODY",
    FOR_WHOLE_PROCESS: "workflow",
    ENTITY_WORKFLOW: "workflow",
    supportedClasses: [
        "ACTION",
        "SCRIPT",
        "AND",
        "OR",
        "TIMER",
        "GROUND",
        "START",
        "END",
        "INFORM",
        "THROUGH",
    ],
    supportedSTStatus: [
        "ST_RUN",
        "ST_PAUSE",
        "ST_DONE",
        "ST_STOP",
        "ST_IGNORE",
        "ST_RETURNED",
        "ST_REVOKED",
        "ST_END",
    ],
};
exports.default = internals;
//# sourceMappingURL=Const.js.map