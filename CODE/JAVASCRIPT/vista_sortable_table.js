// -- FUNCTIONS

function HandleSortableTableColumnClickEvent(
    event
    )
{
    var
        column_element,
        column_element_array,
        order_is_descending,
        sorted_column_element,
        sorted_column_element_index,
        sorted_row_element,
        sorted_row_element_array,
        row_element_array,
        table_element;

    function GetCellValue(
        row_element,
        cell_element_index
        )
    {
        return row_element.GetChildElements( "td" )[ cell_element_index ].GetTextContent();
    }

    function GetCellComparison(
        cell_element_index,
        order_is_descending
        )
    {
        return (
            function(
                first_row_element,
                second_row_element
                )
            {
                var
                    cell_element_comparison,
                    first_cell_element_value,
                    second_cell_element_value;

                cell_element_comparison = 0;
                first_cell_element_value = GetCellValue( first_row_element, cell_element_index ).trim();
                second_cell_element_value = GetCellValue( second_row_element, cell_element_index ).trim();

                if ( IsNumeric( first_cell_element_value )
                     && IsNumeric( second_cell_element_value ) )
                {
                    cell_element_comparison = first_cell_element_value - second_cell_element_value;
                }
                else if ( first_cell_element_value < second_cell_element_value )
                {
                    cell_element_comparison = -1;
                }
                else if ( first_cell_element_value > second_cell_element_value )
                {
                    cell_element_comparison = 1;
                }

                if ( order_is_descending )
                {
                    cell_element_comparison = -cell_element_comparison;
                }

                return cell_element_comparison;
            }
            );
    }

    sorted_column_element = event.currentTarget;
    sorted_column_element.OrderIsDescending = sorted_column_element.HasClass( "order-is-ascending" );
    sorted_column_element_index = sorted_column_element.GetChildElementIndex();
    order_is_descending = sorted_column_element.OrderIsDescending;
    table_element = sorted_column_element.GetAncestorElement( ".sortable-table" );
    column_element_array = table_element.GetDescendantElements( ".sortable-table-column" );

    for ( column_element of column_element_array )
    {
        column_element
            .RemoveClass( "order-is-ascending" )
            .RemoveClass( "order-is-descending" );

        if ( column_element === sorted_column_element )
        {
            if ( order_is_descending )
            {
                column_element.AddClass( "order-is-descending" );
            }
            else
            {
                column_element.AddClass( "order-is-ascending" );
            }
        }
    }

    row_element_array = table_element.GetDescendantElements( "tr:not(:first-child)" );
    sorted_row_element_array = row_element_array.Sort( GetCellComparison( sorted_column_element_index, order_is_descending ) );

    for ( sorted_row_element of sorted_row_element_array )
    {
        table_element.AppendChildElement( sorted_row_element );
    }
}

// ~~

function InitializeSortableTableColumns(
    )
{
    GetElements( ".sortable-table-column" ).AddEventListener( "click", HandleSortableTableColumnClickEvent );
}

// ~~

function FinalizeSortableTableColumns(
    )
{
    GetElements( ".sortable-table-column" ).RemoveEventListener( "click", HandleSortableTableColumnClickEvent );
}
