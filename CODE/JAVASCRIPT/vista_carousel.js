// -- TYPES

class CAROUSEL
{
    // -- CONSTRUCTORS

    constructor(
        carousel_element,
        strip_element,
        slide_index = 0.0,
        slide_count,
        visible_slide_count_by_media_query_map = 1,
        pause_duration = 3.0,
        translation_duration = 0.5,
        carousel_is_perpetual = true,
        slide_button_element_array = null,
        update_function = null,
        slide_width = 0,
        gap_width = 0,
        width_unit = "",
        reset_slide_function = null
        )
    {
        this.HandleResizeEvent = this.HandleResizeEvent.bind( this );
        this.UpdateAnimation = this.UpdateAnimation.bind( this );
        this.UpdateAutomaticAnimation = this.UpdateAutomaticAnimation.bind( this );

        this.AnimationTimeout = null;
        this.AnimationFrame = null,
        this.AnimationTimestamp = null;
        this.Element = carousel_element;
        this.StripElement = strip_element;
        this.PriorSlideIndex = -1.0;
        this.SlideIndex = slide_index;
        this.InitialSlideIndex = slide_index;
        this.FinalSlideIndex = slide_index;
        this.FinalSlideRatio = 1.0;
        this.SlideCount = slide_count;
        this.VisibleSlideCountByMediaQueryMap = visible_slide_count_by_media_query_map;
        this.VisibleSlideCount = 0;
        this.MaximumVisibleSlideCount = 0;
        this.PerpetualSlideCount = 0;
        this.ActualSlideCount = 0;

        if ( IsArray( pause_duration ) )
        {
            this.PauseDurationArray = pause_duration;
        }
        else
        {
            this.PauseDurationArray = [ pause_duration ];
        }

        this.TranslationDuration = translation_duration;
        this.TranslationSpeed = 1.0 / translation_duration;
        this.IsPerpetual = carousel_is_perpetual;
        this.SlideButtonElementArray = slide_button_element_array;
        this.UpdateFunction = update_function;
        this.SlideWidth = slide_width;
        this.GapWidth = gap_width;
        this.WidthUnit = width_unit;
        this.UpdateSlideFunction = reset_slide_function;
        this.IsTranslated = false;
        this.IsAutomatic = false;

        window.addEventListener( "resize", this.HandleResizeEvent );

        this.Resize();
    }

    // -- INQUIRIES

    GetSlideIndex(
        )
    {
        var
            slide_index;

        slide_index = this.FinalSlideIndex - ( 1.0 - this.FinalSlideRatio );

        if ( slide_index < 0 )
        {
            slide_index += this.SlideCount;
        }

        if ( slide_index >= this.SlideCount )
        {
            slide_index -= this.SlideCount;
        }

        return slide_index;
    }

    // ~~

    GetSlideRatio(
        slide_index
        )
    {
        if ( this.SlideCount <= 1 )
        {
            return 1.0;
        }
        else if ( slide_index === this.FinalSlideIndex )
        {
            return this.FinalSlideRatio;
        }
        else if ( slide_index === this.InitialSlideIndex )
        {
            return 1.0 - this.FinalSlideRatio;
        }
        else
        {
            return 0.0;
        }
    }

    // -- OPERATIONS

    SetVisibleSlideCount(
        )
    {
        if ( IsNumber( this.VisibleSlideCountByMediaQueryMap ) )
        {
            this.VisibleSlideCount = this.VisibleSlideCountByMediaQueryMap;
            this.MaximumVisibleSlideCount = this.VisibleSlideCount;
        }
        else
        {
            this.VisibleSlideCount = 1;
            this.MaximumVisibleSlideCount = 1;

            for ( const [ media_query, visible_slide_count ] of Object.entries( this.VisibleSlideCountByMediaQueryMap ) )
            {
                if ( media_query == "default"
                     || window.matchMedia( media_query ).matches )
                {
                    this.VisibleSlideCount = visible_slide_count;
                }

                if ( visible_slide_count > this.MaximumVisibleSlideCount )
                {
                    this.MaximumVisibleSlideCount = visible_slide_count;
                }
            }
        }

        this.PerpetualSlideCount = this.SlideCount - this.MaximumVisibleSlideCount;
        this.ActualSlideCount = this.IsPerpetual ? this.PerpetualSlideCount : this.PerpetualSlideCount + 1;
    }

    // ~~

    SetSlideIndex(
        )
    {
        var
            slide_index;

        if ( this.WidthUnit === "" )
        {
            this.StripElement.style[ "left" ] = ( this.SlideIndex * -100.0 / this.VisibleSlideCount ) + "%";
        }
        else
        {
            this.StripElement.style[ "left" ] = ( -this.SlideIndex * ( this.SlideWidth + this.GapWidth ) ) + this.WidthUnit;
        }

        slide_index = this.GetSlideIndex();

        if ( slide_index !== this.PriorSlideIndex )
        {
            this.PriorSlideIndex = slide_index;

            if ( this.SlideButtonElementArray !== null )
            {
                for ( slide_index = 0;
                      slide_index < this.SlideButtonElementArray.length;
                      ++slide_index )
                {
                    this.SlideButtonElementArray[ slide_index ].ToggleClass(
                        "is-selected",
                        slide_index === this.FinalSlideIndex
                        || ( slide_index === 0 && this.FinalSlideIndex >= this.SlideButtonElementArray.length )
                        );
                }
            }

            if ( this.UpdateFunction !== null )
            {
                this.UpdateFunction( this );
            }
        }
    }

    // ~~

    SetStripWidth(
        )
    {
        if ( this.WidthUnit === "" )
        {
            this.StripElement.style[ "width" ] = ( ( this.SlideCount / this.VisibleSlideCount ) * 100 ) + "%";
        }
        else
        {
            this.StripElement.style[ "width" ] = ( ( this.SlideWidth + this.GapWidth ) * this.SlideCount - this.GapWidth ) + this.WidthUnit;
        }
    }

    // ~~

    SetSlideWidth(
        )
    {
        var
            carousel;

        carousel = this;

        this.StripElement.GetChildElements().Iterate(
            function (
                element
                )
            {
                if ( carousel.WidthUnit === "" )
                {
                    element.style[ "width" ] = ( 100 / carousel.SlideCount ) + "%";
                }
                else
                {
                    element.style[ "width" ] = carousel.SlideWidth + carousel.WidthUnit;
                }
            }
            );
    }

    // ~~

    Resize(
        )
    {
        this.SetVisibleSlideCount();
        this.SetSlideIndex();
        this.SetStripWidth();
        this.SetSlideWidth();
    }

    // ~~

    HandleResizeEvent(
        event
        )
    {
        this.Resize();
    }

    // ~~

    HandleSlideButtonsClickEvent(
        automatic_animation_is_stopped = false,
        automatic_animation_delay_duration = undefined
        )
    {
        var
            carousel,
            slide_button_element,
            slide_index;

        carousel = this;

        for ( slide_index = 0;
              slide_index < this.SlideButtonElementArray.length;
              ++slide_index )
        {
            slide_button_element = this.SlideButtonElementArray[ slide_index ];
            slide_button_element.SlideIndex = slide_index;
            slide_button_element.AddEventListener(
                "click",
                function (
                    event
                    )
                {
                    if ( automatic_animation_is_stopped )
                    {
                        carousel.StopAutomaticAnimation();
                    }
                    else if ( automatic_animation_delay_duration !== undefined )
                    {
                        carousel.DelayAutomaticAnimation( automatic_animation_delay_duration );
                    }

                    carousel.ShowSlide( event.currentTarget.SlideIndex );
                }
                );
        }
    }

    // ~~

    HandlePriorSlideButtonClickEvent(
        prior_slide_button_element,
        automatic_animation_is_stopped = false,
        automatic_animation_delay_duration = undefined
        )
    {
        var
            carousel,
            slide_index;

        carousel = this;

        prior_slide_button_element.AddEventListener(
            "click",
            function (
                event
                )
            {
                if ( automatic_animation_is_stopped )
                {
                    carousel.StopAutomaticAnimation();
                }
                else if ( automatic_animation_delay_duration !== undefined )
                {
                    carousel.DelayAutomaticAnimation( automatic_animation_delay_duration );
                }

                carousel.ShowPriorSlide();
            }
            );
    }

    // ~~

    HandleNextSlideButtonClickEvent(
        next_slide_button_element,
        automatic_animation_is_stopped = false,
        automatic_animation_delay_duration = undefined
        )
    {
        var
            carousel,
            slide_index;

        carousel = this;

        next_slide_button_element.AddEventListener(
            "click",
            function (
                event
                )
            {
                if ( automatic_animation_is_stopped )
                {
                    carousel.StopAutomaticAnimation();
                }
                else if ( automatic_animation_delay_duration !== undefined )
                {
                    carousel.DelayAutomaticAnimation( automatic_animation_delay_duration );
                }

                carousel.ShowNextSlide();
            }
            );
    }

    // ~~

    StartAnimation(
        )
    {
        if ( this.AnimationFrame === null )
        {
            this.AnimationTimestamp = null;
            this.AnimationFrame = window.requestAnimationFrame( this.UpdateAnimation );
        }
    }

    // ~~

    UpdateAnimation(
        timestamp
        )
    {
        var
            final_slide_index_ratio,
            step_time;

        if ( this.AnimationTimestamp === null )
        {
            step_time = 0.0;
        }
        else
        {
            step_time = ( timestamp - this.AnimationTimestamp ) * 0.001;
        }

        this.AnimationTimestamp = timestamp;

        this.FinalSlideRatio += Math.min( step_time * this.TranslationSpeed, 1.0 );

        if ( this.FinalSlideRatio < 1.0 )
        {
            this.SlideIndex
                = this.InitialSlideIndex
                  + ( this.FinalSlideIndex - this.InitialSlideIndex )
                    * GetCubicEaseInOutRatio( this.FinalSlideRatio );

            this.SetSlideIndex();
            this.AnimationFrame = window.requestAnimationFrame( this.UpdateAnimation );
        }
        else
        {
            this.IsTranslated = false;
            this.SlideIndex = Math.round( this.SlideIndex );
            this.FinalSlideRatio = 1.0;
            this.SetSlideIndex();
        }

        if ( this.UpdateSlideFunction !== null )
        {
            this.UpdateSlideFunction( this, this.InitialSlideIndex, this.FinalSlideIndex, this.FinalSlideRatio );
        }
    }

    // ~~

    StopAnimation(
        )
    {
        if ( this.AnimationFrame !== null )
        {
            window.cancelAnimationFrame( this.AnimationFrame );

            this.AnimationFrame = null;
            this.AnimationTimestamp = null;
        }
    }

    // ~~

    ChangeSlide(
        slide_index_offset
        )
    {
        if ( !this.IsTranslated )
        {
            if ( this.IsPerpetual )
            {
                if ( slide_index_offset > 0 )
                {
                    if ( this.SlideIndex >= this.PerpetualSlideCount )
                    {
                        this.SlideIndex -= this.PerpetualSlideCount;
                    }
                }
                else if ( slide_index_offset < 0 )
                {
                    if ( this.SlideIndex == 0 )
                    {
                        this.SlideIndex += this.PerpetualSlideCount;
                    }
                }
            }
            else
            {
                if ( this.SlideIndex + slide_index_offset < 0
                     || this.SlideIndex + slide_index_offset > this.PerpetualSlideCount )
                {
                    slide_index_offset = 0;
                }
            }

            if ( slide_index_offset !== 0 )
            {
                this.InitialSlideIndex = this.SlideIndex;
                this.FinalSlideIndex = this.SlideIndex + slide_index_offset;
                this.FinalSlideRatio = 0.0;
                this.IsTranslated = true;

                this.StopAnimation();
                this.SetSlideIndex();
                this.StartAnimation();
            }
        }
    }

    // ~~

    ShowPriorSlide(
        )
    {
        this.ChangeSlide( -1 );
    }

    // ~~

    ShowNextSlide(
        )
    {
        this.ChangeSlide( 1 );
    }

    // ~~

    ShowSlide(
        slide_index,
        strip_is_animated = true
        )
    {
        var
            current_slide_index;

        if ( this.IsPerpetual
             && this.SlideIndex === this.SlideCount - 1 )
        {
            current_slide_index = 0;
        }
        else
        {
            current_slide_index = this.SlideIndex;
        }

        if ( slide_index !== current_slide_index )
        {
            if ( strip_is_animated )
            {
                this.ChangeSlide( slide_index - current_slide_index, strip_is_animated );
            }
            else
            {
                this.InitialSlideIndex = this.SlideIndex;
                this.FinalSlideIndex = slide_index;
                this.FinalSlideRatio = 0.99999999;
                this.IsTranslated = true;

                this.StopAnimation();
                this.SetSlideIndex();
                this.StartAnimation();
            }
        }
    }

    // ~~ 

    GetPauseDuration(
        )
    {
        var
            slide_index;

        slide_index = this.FinalSlideIndex;

        if ( slide_index >= 0
            && slide_index < this.PauseDurationArray.length )
        {
            return this.PauseDurationArray[ slide_index ];
        }
        else
        {
            return this.PauseDurationArray[ 0 ];
        }
    }

    // ~~

    StartAutomaticAnimation(
        )
    {
        this.StopAutomaticAnimation();
        this.IsAutomatic = true;
        this.AutomaticAnimationTimeout = setTimeout( this.UpdateAutomaticAnimation, this.GetPauseDuration() * 1000.0 );
    }

    // ~~

    UpdateAutomaticAnimation(
        )
    {
        if ( this.IsAutomatic
             && this.ActualSlideCount > 1 )
        {
            this.ShowNextSlide();
            this.AutomaticAnimationTimeout = setTimeout( this.UpdateAutomaticAnimation, ( this.TranslationDuration + this.GetPauseDuration() ) * 1000.0 );
        }
        else
        {
            this.StopAutomaticAnimation();
        }
    }

    // ~~

    DelayAutomaticAnimation(
        delay_duration
        )
    {
        if ( this.AutomaticAnimationTimeout !== null )
        {
            clearTimeout( this.AutomaticAnimationTimeout );
        }

        this.AutomaticAnimationTimeout = setTimeout( this.UpdateAutomaticAnimation, delay_duration * 1000.0 );
    }

    // ~~

    StopAutomaticAnimation(
        )
    {
        this.IsAutomatic = false;

        if ( this.AutomaticAnimationTimeout !== null )
        {
            clearTimeout( this.AutomaticAnimationTimeout );
            this.AutomaticAnimationTimeout = null;
        }
    }

    // ~~

    Reset(
        slide_index = 0
        )
    {
        this.PriorSlideIndex = -1.0;
        this.SlideIndex = slide_index;
        this.InitialSlideIndex = slide_index;
        this.FinalSlideIndex = slide_index;
        this.FinalSlideRatio = 1.0;
        this.IsTranslated = false;

        this.StopAnimation();
        this.SetSlideIndex();
        this.StartAnimation();

        if ( this.IsAutomatic )
        {
            this.StartAutomaticAnimation();
        }
    }
}
