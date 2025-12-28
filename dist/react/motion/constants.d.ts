export declare const DURATION: {
    readonly instant: 0;
    readonly fast: 0.15;
    readonly normal: 0.3;
    readonly slow: 0.5;
    readonly glacial: 0.8;
};
export declare const EASING: {
    readonly linear: readonly [0, 0, 1, 1];
    readonly easeIn: readonly [0.4, 0, 1, 1];
    readonly easeOut: readonly [0, 0, 0.2, 1];
    readonly easeInOut: readonly [0.4, 0, 0.2, 1];
    readonly anticipate: readonly [0.36, 0, 0.66, -0.56];
    readonly overshoot: readonly [0.34, 1.56, 0.64, 1];
    readonly bounce: readonly [0.68, -0.55, 0.265, 1.55];
    readonly cyber: readonly [0.25, 0.46, 0.45, 0.94];
    readonly brutal: readonly [0, 0, 1, 1];
    readonly glass: readonly [0.23, 1, 0.32, 1];
};
export declare const SPRING: {
    readonly gentle: {
        readonly type: "spring";
        readonly stiffness: 120;
        readonly damping: 14;
    };
    readonly snappy: {
        readonly type: "spring";
        readonly stiffness: 300;
        readonly damping: 20;
    };
    readonly bouncy: {
        readonly type: "spring";
        readonly stiffness: 400;
        readonly damping: 10;
    };
    readonly stiff: {
        readonly type: "spring";
        readonly stiffness: 500;
        readonly damping: 30;
    };
};
export declare const STAGGER: {
    readonly none: 0;
    readonly fast: 0.03;
    readonly normal: 0.05;
    readonly slow: 0.1;
};
export declare const Z_INDEX: {
    readonly base: 0;
    readonly dropdown: 100;
    readonly modal: 200;
    readonly tooltip: 300;
    readonly notification: 400;
    readonly overlay: 500;
};
//# sourceMappingURL=constants.d.ts.map