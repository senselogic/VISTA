// -- VARIABLES

var
    StyleAnimationFrame = null,
    StyleAnimationIdentifier = -1,
    StyleAnimationMap = new Map(),
    StyleAnimationTimestamp = null,
    StyleTransformNameArray = [
        "translateX",
        "translateY",
        "translateZ",
        "rotateX",
        "rotateY",
        "rotateZ",
        "scaleX",
        "scaleY",
        "scaleZ",
        "perspective"
        ];

// -- TYPES

class VISTA_STYLE_ANIMATION
{
    // -- CONSTRUCTORS

    constructor(
        element,
        style_name,
        style_value_array,
        style_time_array,
        animation_configuration
        )
    {
        var
            first_style_value,
            style_value;

        first_style_value = this.GetFirstStyleValue( style_value_array );

        this.Identifier = ++StyleAnimationIdentifier;
        this.Name = style_name;
        this.Element = element;
        this.IsNumeric = IsNumericText( first_style_value );
        this.IsColor = IsColorText( first_style_value );
        this.IsTransform = ( style_name == "transform" );
        this.IsClass = ( style_name == "class" );
        this.IsConstant = ( !this.IsNumeric && !this.IsColor && !this.IsTransform );
        this.State = 0;

        this.ParseValueFunction = animation_configuration.ParseValueFunction;
        this.GetRatioFunction = animation_configuration.GetRatioFunction;
        this.GetStyleFunction = animation_configuration.GetStyleFunction;
        this.SetStyleFunction = animation_configuration.SetStyleFunction;
        this.GetInterpolationFunction = animation_configuration.GetInterpolationFunction;

        if ( this.GetRatioFunction === undefined )
        {
            this.GetRatioFunction = GetLinearRatio;
        }

        if ( this.ParseValueFunction === undefined )
        {
            if ( this.IsNumeric )
            {
                this.ParseValueFunction = ParseNumericText;
            }
            else if ( this.IsColor )
            {
                this.ParseValueFunction = ParseColorText;
            }
            else if ( this.IsTransform )
            {
                this.ParseValueFunction = ParseTransformText;
            }
            else
            {
                this.ParseValueFunction = ParseConstantText;
            }
        }

        if ( this.GetStyleFunction === undefined )
        {
            if ( this.IsNumeric )
            {
                this.GetStyleFunction = GetNumericStyle;
            }
            else if ( this.IsColor )
            {
                this.GetStyleFunction = GetColorStyle;
            }
            else if ( this.IsTransform )
            {
                this.GetStyleFunction = GetTransformStyle;
            }
            else if ( this.IsClass )
            {
                this.GetStyleFunction = GetClassStyle;
            }
            else
            {
                this.GetStyleFunction = GetConstantStyle;
            }
        }

        if ( this.SetStyleFunction === undefined )
        {
            if ( this.IsNumeric )
            {
                this.SetStyleFunction = SetNumericStyle;
            }
            else if ( this.IsColor )
            {
                this.SetStyleFunction = SetColorStyle;
            }
            else if ( this.IsTransform )
            {
                this.SetStyleFunction = SetTransformStyle;
            }
            else if ( this.IsClass )
            {
                this.SetStyleFunction = SetClassStyle;
            }
            else
            {
                this.SetStyleFunction = SetConstantStyle;
            }
        }

        if ( this.GetInterpolationFunction === undefined )
        {
            if ( this.IsNumeric )
            {
                this.GetInterpolationFunction = GetNumericInterpolation;
            }
            else if ( this.IsColor )
            {
                this.GetInterpolationFunction = GetColorInterpolation;
            }
            else if ( this.IsTransform )
            {
                this.GetInterpolationFunction = GetTransformInterpolation;
            }
            else
            {
                this.GetInterpolationFunction = GetConstantInterpolation;
            }
        }

        this.ValueArray = [];

        if ( style_value_array instanceof Array )
        {
            for ( style_value of style_value_array )
            {
                if ( style_value === "." )
                {
                    this.ValueArray.AddLastValue( this.GetStyleFunction( element, style_name ) );
                }
                else
                {
                    this.ValueArray.AddLastValue( this.ParseValueFunction( style_value ) );
                }
            }
        }
        else
        {
            if ( style_value_array === "." )
            {
                this.ValueArray = [ this.GetStyleFunction( element, style_name ) ];
            }
            else
            {
                this.ValueArray = [ this.ParseValueFunction( style_value_array ) ];
            }
        }

        if ( style_time_array instanceof Array )
        {
            this.TimeArray = style_time_array.slice();
        }
        else
        {
            this.TimeArray = [ style_time_array ];
        }

        this.Time = animation_configuration.Time;
        this.Speed = animation_configuration.Speed;
        this.IsLooping = animation_configuration.IsLooping;
        this.StartFunction = animation_configuration.StartFunction;
        this.PauseFunction = animation_configuration.PauseFunction;
        this.ResumeFunction = animation_configuration.ResumeFunction;
        this.StopFunction = animation_configuration.StopFunction;
        this.UpdateFunction = animation_configuration.UpdateFunction;

        if ( this.Time === undefined )
        {
            this.Time = 0.0;
        }

        if ( this.IsLooping === undefined )
        {
            this.IsLooping = false;
        }

        if ( this.Duration === undefined )
        {
            this.Duration = this.TimeArray[ this.TimeArray.length - 1 ];

            if ( this.Speed === undefined )
            {
                this.Speed = 1.0;
            }
        }
        else
        {
            this.Speed = this.TimeArray[ this.TimeArray.length - 1 ] / this.Duration;
        }

        this.PriorValueIndex = 0;
        this.NextValueIndex = 0;
    }

    // -- INQUIRIES

    GetFirstStyleValue(
        style_value_array
        )
    {
        var
            style_value;

        if ( style_value_array instanceof Array )
        {
            for ( style_value of style_value_array )
            {
                if ( style_value !== "." )
                {
                    return style_value;
                }
            }

            return "";
        }
        else
        {
            return style_value_array;
        }
    }

    // -- OPERATIONS

    Start(
        )
    {
        this.State = 0;

        if ( this.StartFunction !== undefined )
        {
            this.StartFunction( this );
        }

        StyleAnimationMap.SetValue( this.Identifier, this );

        if ( StyleAnimationMap.size === 1 )
        {
            StartAnimation();
        }
    }

    // ~~

    Pause(
        )
    {
        this.State = 1;

        if ( this.PauseFunction !== undefined )
        {
            this.PauseFunction( this );
        }

        StyleAnimationMap.delete( this.Identifier );

        if ( StyleAnimationMap.size === 0 )
        {
            StopAnimation();
        }
    }

    // ~~

    Resume(
        )
    {
        this.State = 0;

        if ( this.ResumeFunction !== undefined )
        {
            this.ResumeFunction( this );
        }

        StyleAnimationMap.SetValue( this.Identifier, this );

        if ( StyleAnimationMap.size === 1 )
        {
            StartAnimation();
        }
    }

    // ~~

    Stop(
        )
    {
        this.State = 2;

        if ( this.StopFunction !== undefined )
        {
            this.StopFunction( this );
        }

        StyleAnimationMap.delete( this.Identifier );

        if ( StyleAnimationMap.size === 0 )
        {
            StopAnimation();
        }
    }

    // ~~

    Update(
        step_time
        )
    {
        var
            prior_time,
            prior_value,
            prior_value_index,
            next_time,
            next_value,
            next_value_index,
            next_value_ratio,
            value,
            value_count,
            value_duration,
            value_time;

        this.Time += step_time * this.Speed;

        if ( this.Time >= this.TimeArray[ 0 ] )
        {
            if ( this.Time >= this.Duration )
            {
                if ( this.IsLooping )
                {
                    while ( this.Time >= this.Duration )
                    {
                        this.Time -= this.Duration;
                    }
                }
                else
                {
                    this.Time = this.Duration;
                }
            }

            value_count = this.ValueArray.length;

            prior_value_index = this.PriorValueIndex;

            while ( prior_value_index >= 1
                    && this.Time < this.TimeArray[ prior_value_index ] )
            {
                --prior_value_index;
            }

            while ( prior_value_index + 1 < value_count
                    && this.Time > this.TimeArray[ prior_value_index + 1 ] )
            {
                ++prior_value_index;
            }

            this.PriorValueIndex = prior_value_index;

            next_value_index = prior_value_index + 1;

            if ( next_value_index >= value_count )
            {
                next_value_index = prior_value_index;
            }

            this.NextValueIndex = next_value_index;

            prior_time = this.TimeArray[ prior_value_index ];
            prior_value = this.ValueArray[ prior_value_index ];

            next_time = this.TimeArray[ next_value_index ];
            next_value = this.ValueArray[ next_value_index ];

            value_time = this.Time - prior_time;
            value_duration = next_time - prior_time;

            if ( value_duration === 0.0 )
            {
                value = next_value;
            }
            else
            {
                next_value_ratio = value_time / value_duration;

                if ( next_value_ratio <= 0.0 )
                {
                    value = prior_value;
                }
                else if ( next_value_ratio >= 1.0 )
                {
                    value = next_value;
                }
                else
                {
                    value
                        = this.GetInterpolationFunction(
                              prior_value,
                              next_value,
                              this.GetRatioFunction( next_value_ratio )
                              );
                }
            }

            this.SetStyleFunction(
                this.Element,
                this.Name,
                value
                );

            if ( this.UpdateFunction !== undefined )
            {
                this.UpdateFunction( this );
            }

            if ( this.Time === this.Duration
                 && !this.IsLooping )
            {
                this.Stop();
            }
        }
    }
}

// -- FUNCTIONS

function IsNumericText(
    text
    )
{
    var
        character_code;

    if ( text.length > 0 )
    {
        character_code = text.charCodeAt( 0 );

        if ( character_code === 45
             && text.length >= 1 )
        {
            character_code = text.charCodeAt( 1 );
        }

        return (
            character_code >= 48
            && character_code <= 57
            );
    }
    else
    {
        return false;
    }
}

// ~~

function IsColorText(
    text
    )
{
    return (
        text.HasPrefix( "#" )
        || text.HasPrefix( "rgb(" )
        || text.HasPrefix( "rgba(" )
        );
}

// ~~

function ParseNumericText(
    text
    )
{
    var
        amount,
        unit;

    unit = GetUnit( text );

    if ( unit === "" )
    {
        amount = GetReal( text );
    }
    else
    {
        amount = GetReal( text.RemoveSuffix( unit ) );
    }

    return {
        Amount : amount,
        Unit : unit
        };
}

// ~~

function ParseHexadecimalText(
    text,
    first_character_index = 0,
    last_character_index = -1,
    digits_are_repeated = false
    )
{
    var
        character_code,
        character_index,
        hexadecimal_digit,
        integer;

    if ( last_character_index < 0 )
    {
        last_character_index += text.length;
    }

    integer = 0;

    for ( character_index = first_character_index;
          character_index <= last_character_index;
          ++character_index )
    {
        character_code = text.charCodeAt( character_index );

        if ( character_code >= 97 )
        {
            hexadecimal_digit = character_code - 87;
        }
        else if ( character_code >= 65 )
        {
            hexadecimal_digit = character_code - 55;
        }
        else
        {
            hexadecimal_digit = character_code - 48;
        }

        integer = ( integer * 16 ) + hexadecimal_digit;

        if ( digits_are_repeated )
        {
            integer = ( integer * 16 ) + hexadecimal_digit;
        }
    }

    return integer;
}

// ~~

function ParseColorText(
    text
    )
{
    var
        component_array;

    text = text.ReplaceText( " ", "" );

    if ( text.HasPrefix( "#" ) )
    {
        if ( text.length == 4 )
        {
            return {
                Red : ParseHexadecimalText( text, 1, 1, true ),
                Green : ParseHexadecimalText( text, 2, 2, true ),
                Blue : ParseHexadecimalText( text, 3, 3, true ),
                Opacity : 1.0
                };
        }
        else
        {
            return {
                Red : ParseHexadecimalText( text, 1, 2 ),
                Green : ParseHexadecimalText( text, 3, 4 ),
                Blue : ParseHexadecimalText( text, 5, 6 ),
                Opacity : 1.0
                };
        }
    }
    else if ( text.HasSuffix( ")" ) )
    {
        if ( text.HasPrefix( "rgb(" ) )
        {
            component_array = text.substring( 4, text.length - 1 ).Split( "," );

            return {
                Red : GetReal( component_array[ 0 ] ),
                Green : GetReal( component_array[ 1 ] ),
                Blue : GetReal( component_array[ 2 ] ),
                Opacity : 1.0
                };
        }
        else if ( text.HasPrefix( "rgba(" ) )
        {
            component_array = text.substring( 5, text.length - 1 ).Split( "," );

            return {
                Red : GetReal( component_array[ 0 ] ),
                Green : GetReal( component_array[ 1 ] ),
                Blue : GetReal( component_array[ 2 ] ),
                Opacity : GetReal( component_array[ 3 ] )
                };
        }
    }

    return {
        Red : 255,
        Green : 255,
        Blue : 255,
        Opacity : 1.0
        };
}

// ~~

function ParseTransformText(
    text
    )
{
    var
        component,
        component_array,
        parenthesis_character_index,
        transform;

    transform = new Map();
    component_array = text.ReplaceText( " ", "" ).Split( ")" );

    for ( component of component_array )
    {
        parenthesis_character_index = component.indexOf( "(" );

        if ( parenthesis_character_index > 0 )
        {
            transform.set(
                component.substring( 0, parenthesis_character_index ),
                ParseNumericText( component.substring( parenthesis_character_index + 1 ) )
                );
        }
    }

    return transform;
}

// ~~

function ParseConstantText(
    text
    )
{
    return text;
}

// ~~

function GetNumericStyle(
    element,
    style_name
    )
{
    return ParseNumericText( element.GetStyle( style_name ) );
}

// ~~

function GetColorStyle(
    element,
    style_name
    )
{
    return ParseColorText( element.GetStyle( style_name ) );
}

// ~~

function GetTransformStyle(
    element,
    style_name
    )
{
    return ParseTransformText( element.style[ style_name ] );
}

// ~~

function GetConstantStyle(
    element,
    style_name
    )
{
    return element.GetStyle( style_name );
}

// ~~

function GetClassStyle(
    element,
    style_name
    )
{
    return [ ...element.classList ].join( " " );
}

// ~~

function SetNumericStyle(
    element,
    style_name,
    number
    )
{
    element.style[ style_name ] = number.Amount + number.Unit;
}

// ~~

function SetColorStyle(
    element,
    style_name,
    color
    )
{
    element.style[ style_name ]
        = "rgba(" + color.Red + "," + color.Green + "," + color.Blue + "," + color.Opacity + ")";
}

// ~~

function SetTransformStyle(
    element,
    style_name,
    transform
    )
{
    var
        operation,
        operation_name,
        style;

    style = "";

    for ( operation_name of transform.keys() )
    {
        operation = transform.get( operation_name );

        style += operation_name + "(" + operation.Amount + operation.Unit + ")";
    }

    element.style[ style_name ] = style;
}

// ~~

function SetConstantStyle(
    element,
    style_name,
    constant
    )
{
    element.style[ style_name ] = constant;
}

// ~~

function SetClassStyle(
    element,
    style_name,
    class_name_text
    )
{
    var
        class_name;

    if ( class_name_text !== "" )
    {
        for ( class_name of class_name_text.split( " " ) )
        {
            if ( class_name.startsWith( "-" ) )
            {
                element.classList.remove( class_name.substring( 1 ) );
            }
            else if ( class_name.startsWith( "+" ) )
            {
                element.classList.add( class_name.substring( 1 ) );
            }
            else
            {
                element.classList.add( class_name );
            }
        }
    }
}

// ~~

function GetNumericInterpolation(
    initial_number,
    final_number,
    final_number_ratio
    )
{
    return {
        Amount : initial_number.Amount + ( final_number.Amount - initial_number.Amount ) * final_number_ratio,
        Unit : final_number.Unit
        };
}

// ~~

function GetColorInterpolation(
    initial_color,
    final_color,
    final_color_ratio
    )
{
    return {
        Red : ( initial_color.Red + ( final_color.Red - initial_color.Red ) * final_color_ratio ),
        Green : ( initial_color.Green + ( final_color.Green - initial_color.Green ) * final_color_ratio ),
        Blue : ( initial_color.Blue + ( final_color.Blue - initial_color.Blue ) * final_color_ratio ),
        Opacity : ( initial_color.Opacity + ( final_color.Opacity - initial_color.Opacity ) * final_color_ratio )
        };
}

// ~~

function GetTransformInterpolation(
    initial_transform,
    final_transform,
    final_transform_ratio
    )
{
    var
        interpolated_transform,
        operation_name;

    if ( final_transform_ratio <= 0.0 )
    {
        return initial_transform;
    }
    else if ( final_transform_ratio >= 1.0 )
    {
        return final_transform;
    }
    else
    {
        interpolated_transform = new Map();

        for ( operation_name of final_transform.keys() )
        {
            if ( initial_transform.HasKey( operation_name ) )
            {
                interpolated_transform.set(
                    operation_name,
                    GetNumericInterpolation(
                        initial_transform.get( operation_name ),
                        final_transform.get( operation_name ),
                        final_transform_ratio
                        )
                    );
            }
        }

        return interpolated_transform;
    }
}

// ~~

function GetConstantInterpolation(
    initial_constant,
    final_constant,
    final_constant_ratio
    )
{
    if ( final_constant_ratio < 1.0 )
    {
        return initial_constant;
    }
    else
    {
        return final_constant;
    }
}

// ~~

function StartAnimation(
    )
{
    if ( StyleAnimationFrame === null )
    {
        StyleAnimationFrame = window.requestAnimationFrame( UpdateAnimation );
    }
}

// ~~

function UpdateAnimation(
    timestamp
    )
{
    var
        step_time,
        style_animation;

    if ( StyleAnimationTimestamp === null )
    {
        step_time = 0.0;
    }
    else
    {
        step_time = ( timestamp - StyleAnimationTimestamp ) * 0.001;
    }

    StyleAnimationTimestamp = timestamp;

    for ( style_animation of StyleAnimationMap.values() )
    {
        style_animation.Update( step_time );
    }

    StyleAnimationFrame = window.requestAnimationFrame( UpdateAnimation );
}

// ~~

function StopAnimation(
    )
{
    if ( StyleAnimationFrame !== null )
    {
        window.cancelAnimationFrame( StyleAnimationFrame );

        StyleAnimationFrame = null;
    }
}

// ~~

HTMLElement.prototype.AnimateStyle = function (
    style_name,
    style_value_array,
    style_time_array,
    animation_configuration = {}
    )
{
    var
        style_animation;

    if ( this.StyleAnimationMap === undefined )
    {
        this.StyleAnimationMap = new Map();
    }

    if ( this.StyleAnimationMap.HasKey( style_name ) )
    {
        this.StyleAnimationMap.GetValue( style_name ).Stop();
    }

    style_animation
        = new VISTA_STYLE_ANIMATION(
              this,
              style_name,
              style_value_array,
              style_time_array,
              animation_configuration
              );

    this.StyleAnimationMap.SetValue( style_name, style_animation );

    style_animation.Start();
}

// ~~

HTMLElement.prototype.AnimateStyles = function (
    style_value_array_map,
    style_time_array,
    animation_configuration = {}
    )
{
    var
        style_name;

    for ( style_name in style_value_array_map )
    {
        if ( style_value_array_map.hasOwnProperty( style_name ) )
        {
            this.AnimateStyle(
                style_name,
                style_value_array_map[ style_name ],
                style_time_array,
                animation_configuration
                );
        }
    }
}

// ~~

HTMLElement.prototype.PauseStyle = function (
    style_name
    )
{
    if ( this.StyleAnimationMap !== undefined
         && this.StyleAnimationMap.HasKey( style_name ) )
    {
        this.StyleAnimationMap.GetValue( style_name ).Pause();
    }
}

// ~~

HTMLElement.prototype.PauseStyles = function (
    style_name_array
    )
{
    var
        style_animation,
        style_name;

    if ( style_name_array === undefined )
    {
        if ( this.StyleAnimationMap !== undefined )
        {
            for ( style_animation of this.StyleAnimationMap.values() )
            {
                style_animation.Pause();
            }
        }
    }
    else
    {
        for ( style_name of style_name_array )
        {
            this.PauseStyle( style_name );
        }
    }
}

// ~~

HTMLElement.prototype.ResumeStyle = function (
    style_name
    )
{
    if ( this.StyleAnimationMap !== undefined
         && this.StyleAnimationMap.HasKey( style_name ) )
    {
        this.StyleAnimationMap.GetValue( style_name ).Resume();
    }
}

// ~~

HTMLElement.prototype.ResumeStyles = function (
    style_name_array
    )
{
    var
        style_animation,
        style_name;

    if ( style_name_array === undefined )
    {
        if ( this.StyleAnimationMap !== undefined )
        {
            for ( style_animation of this.StyleAnimationMap.values() )
            {
                style_animation.Resume();
            }
        }
    }
    else
    {
        for ( style_name of style_name_array )
        {
            this.ResumeStyle( style_name );
        }
    }
}

// ~~

HTMLElement.prototype.StopStyle = function (
    style_name
    )
{
    if ( this.StyleAnimationMap !== undefined
         && this.StyleAnimationMap.HasKey( style_name ) )
    {
        this.StyleAnimationMap.GetValue( style_name ).Stop();
    }
}

// ~~

HTMLElement.prototype.StopStyles = function (
    style_name_array
    )
{
    var
        style_animation,
        style_name;

    if ( style_name_array === undefined )
    {
        if ( this.StyleAnimationMap !== undefined )
        {
            for ( style_animation of this.StyleAnimationMap.values() )
            {
                style_animation.Stop();
            }
        }
    }
    else
    {
        for ( style_name of style_name_array )
        {
            this.StopStyle( style_name );
        }
    }
}

// ~~

Array.prototype.AnimateStyle = function (
    style_name,
    style_value_array,
    style_time_array,
    animation_configuration = {}
    )
{
    var
        element;

    for ( element of this )
    {
        element.AnimateStyle(
            style_name,
            style_value_array,
            style_time_array,
            animation_configuration
            );
    }

    return this;
}

// ~~

Array.prototype.AnimateStyles = function (
    style_value_array_map,
    style_time_array,
    animation_configuration = {}
    )
{
    var
        element;

    for ( element of this )
    {
        element.AnimateStyles(
            style_value_array_map,
            style_time_array,
            animation_configuration
            );
    }

    return this;
}

// ~~

Array.prototype.PauseStyle = function (
    style_name
    )
{
    var
        element;

    for ( element of this )
    {
        element.PauseStyle( style_name );
    }

    return this;
}

// ~~

Array.prototype.PauseStyles = function (
    style_name_array
    )
{
    var
        element;

    for ( element of this )
    {
        element.PauseStyles( style_name_array );
    }

    return this;
}

// ~~

Array.prototype.ResumeStyle = function (
    style_name
    )
{
    var
        element;

    for ( element of this )
    {
        element.ResumeStyle( style_name );
    }

    return this;
}

// ~~

Array.prototype.ResumeStyles = function (
    style_name_array
    )
{
    var
        element;

    for ( element of this )
    {
        element.ResumeStyles( style_name_array );
    }

    return this;
}

// ~~

Array.prototype.StopStyle = function (
    style_name
    )
{
    var
        element;

    for ( element of this )
    {
        element.StopStyle( style_name );
    }

    return this;
}

// ~~

Array.prototype.StopStyles = function (
    style_name_array
    )
{
    var
        element;

    for ( element of this )
    {
        element.StopStyles( style_name_array );
    }

    return this;
}

