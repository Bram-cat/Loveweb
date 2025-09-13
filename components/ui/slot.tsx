import * as React from "react"

const Slot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ asChild, ...props }, ref) => {
  if (asChild) {
    return React.cloneElement(
      React.Children.only(props.children as React.ReactElement),
      {
        ...props,
        ref,
      }
    )
  }

  return <div {...props} ref={ref} />
})
Slot.displayName = "Slot"

export { Slot }